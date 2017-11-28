const isString = require('lodash/isString');
const isEmpty = require('lodash/isEmpty');

const {wrapResponseSuccess, wrapResponseError} = require('../utils/response');
const {isMockId} = require('../utils/mock');
const MOCK_START = require('../mock/start');
const MOCK_QUESTIONS = require('../mock/questions');
const {MOCK_NUMBER} = require('../constants/restrictions');
const REGEX = require('../constants/regex');
const ERROR_CODES = require('../constants/error-codes');

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

    const userId = get(body, 'id');
    const email = get(body, 'email');
    const link = get(body, 'link');
    const answers = get(body, 'result');

    if (isEmpty(userId) || !isString(userId) || isEmpty(email) || isEmpty(link)) {
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

    if (isMockId(userId)) {
        if (userId !== MOCK_START.id) {
            res.json(wrapResponseError(ERROR_CODES.WHO_ARE_YOU));

            return;
        }

        if (Object.values(answers).length !== MOCK_NUMBER) {
            res.json(wrapResponseError(ERROR_CODES.EENY_MEENY_MINY_MOE));

            return;
        }

        res.json(wrapResponseSuccess(prepareResponse(MOCK_QUESTIONS)));

        return;
    }

    // Real response

    const result = {};

    // TODO:

    res.json(wrapResponseSuccess(result));
};
