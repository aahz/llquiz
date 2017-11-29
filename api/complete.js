const get = require('lodash/get');
const find = require('lodash/find');
const isString = require('lodash/isString');
const isEmpty = require('lodash/isEmpty');
const isError = require('lodash/isError');

const {wrapResponseSuccess, wrapResponseError} = require('../utils/response');
const {isMockId} = require('../utils/mock');
const MOCK_START = require('../mock/start');
const MOCK_QUESTIONS = require('../mock/questions');
const {TIME_FOR_ONE_QUESTION, MOCK_NUMBER} = require('../constants/restrictions');
const REGEX = require('../constants/regex');
const ERROR_CODES = require('../constants/error-codes');

const {CandidateModel} = require('../models/candidate');
const {QuestionModel} = require('../models/question');

function prepareResponse(questions) {
    const response = {};

    MOCK_QUESTIONS.forEach(question => {
        const variants = get(question, 'variants', []);

        response[get(question, 'id')] = get(variants.filter(variant => variant.isCorrect), [0, 'id']);
    });

    return response;
}

module.exports = function (req, res) {
    const {body} = req;

    const id = get(body, 'id');
    const email = get(body, 'email');
    const link = get(body, 'link');
    const answers = get(body, 'result', {});
    const answersLength = Object.values(answers).length;

    if (isEmpty(id) || !isString(id) || isEmpty(email) || isEmpty(link)) {
        res.json(wrapResponseError(ERROR_CODES.INSUFFICIENT_DATA));

        return;
    }

    if (!REGEX.URL.test(link)) {
        res.json(wrapResponseError(ERROR_CODES.NO_CHERRY_ON_THE_CAKE));

        return;
    }

    if (!REGEX.EMAIL.test(email)) {
        res.json(wrapResponseError(ERROR_CODES.ANONYMOUS_FOUND));

        return;
    }

    if (!Object.values(answers).every(isString)) {
        res.json(wrapResponseError(ERROR_CODES.RAMBLING));

        return;
    }

    if (isMockId(id)) {
        if (id !== MOCK_START.id) {
            res.json(wrapResponseError(ERROR_CODES.WHO_ARE_YOU));

            return;
        }

        if (answersLength !== MOCK_NUMBER) {
            res.json(wrapResponseError(ERROR_CODES.EENY_MEENY_MINY_MOE));

            return;
        }

        res.json(wrapResponseSuccess(prepareResponse(MOCK_QUESTIONS)));

        return;
    }

    const completedTimestamp = Date.now();
    const completedAt = new Date(completedTimestamp);

    let shouldBeStartedAt = new Date(completedTimestamp);

    new Promise((resolve, reject) => {
        QuestionModel.find()
            .exec((error, questions) => {
                if (error) {
                    reject(ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE);

                    return;
                }

                const correctAnswers = {};
                let correctAnswersLength = 0;

                questions.forEach(question => {
                    correctAnswers[question.id] = find(question.variants, {isCorrect: true}).id;
                    correctAnswersLength += 1;
                });

                shouldBeStartedAt = new Date(completedTimestamp - Object.values(correctAnswers).length * TIME_FOR_ONE_QUESTION);

                resolve({correctAnswers, correctAnswersLength});
            });
    })
        .then(({correctAnswers, correctAnswersLength}) => new Promise((resolve, reject) => {
            CandidateModel.findOne({_id: id})
                .exec((error, candidate) => {
                    if (error) {
                        reject(ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE);

                        return;
                    }

                    if (isEmpty(candidate)) {
                        reject(ERROR_CODES.WHO_ARE_YOU);

                        return;
                    }

                    if (!isEmpty(candidate.result.answers)) {
                        reject(ERROR_CODES.NO_SECOND_CHANCE);

                        return;
                    }

                    if (shouldBeStartedAt > new Date(candidate.result.startedAt)) {
                        reject(ERROR_CODES.NOT_FAST_ENOUGH);

                        return;
                    }

                    if (answersLength !== correctAnswersLength) {
                        reject(ERROR_CODES.EENY_MEENY_MINY_MOE);

                        return;
                    }

                    candidate.email = email;
                    candidate.result.link = link;
                    candidate.result.answers = answers;
                    candidate.result.completedAt = completedAt;

                    candidate.save(error => {
                        if (error) {
                            reject(ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE);

                            return;
                        }

                        res.json(wrapResponseSuccess(correctAnswers));
                    });
                });
        }))
        .catch(code => {
            res.json(wrapResponseError(isError(code) ? ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE : code));
        });
};
