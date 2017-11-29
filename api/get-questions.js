const get = require('lodash/get');
const omit = require('lodash/omit');
const shuffle = require('lodash/shuffle');
const isString = require('lodash/isString');
const isEmpty = require('lodash/isEmpty');
const isError = require('lodash/isError');

const {wrapResponseSuccess, wrapResponseError} = require('../utils/response');
const {isMockId} = require('../utils/mock');
const {TIME_FOR_ONE_QUESTION} = require('../constants/restrictions');
const ERROR_CODES = require('../constants/error-codes');
const MOCK_START = require('../mock/start');
const MOCK_QUESTIONS = require('../mock/questions');

const {CandidateModel} = require('../models/candidate');
const {QuestionModel} = require('../models/question');

function prepareResponse(questions) {
    return shuffle(questions || []).map(question => {
        return Object.assign({}, question, {
            variants: shuffle(question.variants || []).map(variant => omit(variant, 'isCorrect')),
        });
    });
}

module.exports = function (req, res) {
    const {body} = req;

    const id = get(body, 'id');

    if (isEmpty(id) || !isString(id)) {
        res.json(wrapResponseError(ERROR_CODES.INSUFFICIENT_DATA));

        return;
    }

    if (isMockId(id)) {
        if (id !== MOCK_START.id) {
            res.json(wrapResponseError(ERROR_CODES.WHO_ARE_YOU));

            return;
        }

        res.json(wrapResponseSuccess({
            restriction: TIME_FOR_ONE_QUESTION * MOCK_QUESTIONS.length,
            questions: prepareResponse(MOCK_QUESTIONS),
        }));

        return;
    }

    new Promise((resolve, reject) => {
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

                candidate.result.startedAt = Date.now();

                candidate.save(error => {
                    if (error) {
                        reject(ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE);

                        return;
                    }

                    resolve();
                });
            });
    })
        .then(() => new Promise((resolve, reject) => {
            QuestionModel.find()
                .exec((error, questions) => {
                    if (error) {
                        console.log(error);
                        reject(ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE);

                        return;
                    }

                    res.json(wrapResponseSuccess({
                        restriction: TIME_FOR_ONE_QUESTION * questions.length,
                        questions: questions.map(question => ({
                            id: question.id,
                            text: question.text,
                            expression: question.expression,
                            variants: question.variants.map(variant => ({
                                id: variant.id,
                                text: variant.text,
                            })),
                        })),
                    }));
                });
        }))
        .catch(code => {
            res.json(wrapResponseError(isError(code) ? ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE : code));
        });
};
