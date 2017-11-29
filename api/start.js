const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const isError = require('lodash/isError');
const isBoolean = require('lodash/isBoolean');

const {wrapResponseSuccess, wrapResponseError} = require('../utils/response');
const ERROR_CODES = require('../constants/error-codes');
const MOCK_START = require('../mock/start');
const {CandidateModel} = require('../models/candidate');

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

    new Promise((resolve, reject) => {
        CandidateModel.findOne({skype})
            .exec((error, candidate) => {
                if (error) {
                    reject(ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE);

                    return;
                }

                if (!isEmpty(candidate)) {
                    reject(ERROR_CODES.NO_SECOND_CHANCE);

                    return;
                }

                resolve();
            });
    })
        .then(() => new Promise((resolve, reject) => {
            const candidate = new CandidateModel({name, skype});

            candidate.save(error => {
                if (error) {
                    reject(ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE);

                    return;
                }

                res.json(wrapResponseSuccess({id: candidate.id}));
            });
        }))
        .catch(code => {
            res.json(wrapResponseError(isError(code) ? ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE : code));
        });
};
