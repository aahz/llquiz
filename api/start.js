const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const isBoolean = require('lodash/isBoolean');

const {wrapResponseSuccess, wrapResponseError} = require('../utils/response');
const ERROR_CODES = require('../constants/error-codes');
const MOCK_START = require('../mock/start');

module.exports = function (req, res) {
    const {body} = req;

    const name = get(body, 'name');
    const skype = get(body, 'skype');
    const isFinalAttempt = get(body, 'isFinalAttempt', false);

    if (isEmpty(name) || isEmpty(skype) || !isBoolean(isFinalAttempt)) {
        res.json(wrapResponseError(ERROR_CODES.INSUFFICIENT_DATA));

        return;
    }

    if (!isFinalAttempt) {
        res.json(wrapResponseSuccess(MOCK_START));

        return;
    }

    // Real response

    const result = {};

    // TODO:

    res.json(wrapResponseSuccess(result));
};
