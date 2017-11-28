const get = require('lodash/get');
const omit = require('lodash/omit');
const shuffle = require('lodash/shuffle');
const isString = require('lodash/isString');
const isEmpty = require('lodash/isEmpty');

const {wrapResponseSuccess, wrapResponseError} = require('../utils/response');
const {isMockId} = require('../utils/mock');
const ERROR_CODES = require('../constants/error-codes');
const MOCK_START = require('../mock/start');
const MOCK_QUESTIONS = require('../mock/questions');

function prepareResponse(questions) {
    return shuffle(questions || []).map(question => {
        return Object.assign({}, question, {
            variants: shuffle(question.variants || []).map(variant => omit(variant, 'isCorrect')),
        });
    });
}

module.exports = function (req, res) {
    const {body} = req;

    const userId = get(body, 'id');

    if (isEmpty(userId) || !isString(userId)) {
        res.json(wrapResponseError(ERROR_CODES.INSUFFICIENT_DATA));

        return;
    }

    if (isMockId(userId)) {
        if (userId !== MOCK_START.id) {
            res.json(wrapResponseError(ERROR_CODES.WHO_ARE_YOU));

            return;
        }

        res.json(wrapResponseSuccess(prepareResponse(MOCK_QUESTIONS)));

        return;
    }

    // Real response

    const result = [];

    // TODO:

    res.json(wrapResponseSuccess(prepareResponse(result)));
};
