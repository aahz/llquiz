const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const isError = require('lodash/isError');
const isBoolean = require('lodash/isBoolean');

const {wrapResponseSuccess, wrapResponseError} = require('../utils/response');
const ERROR_CODES = require('../constants/error-codes');
const REGEX = require('../constants/regex');
const MOCK_START = require('../mock/start');
const {CandidateModel} = require('../models/candidate');

module.exports = function (req, res) {
    const {body} = req;

    const name = get(body, 'name');
    const skype = get(body, 'skype');
    const link = get(body, 'link');
    const cv = get(body, 'cv');
    const isFinalAttempt = get(body, 'isFinalAttempt', false);

    if (isEmpty(name) || isEmpty(skype) || isEmpty(link) || isEmpty(cv) || !isBoolean(isFinalAttempt)) {
        res.json(wrapResponseError(ERROR_CODES.INSUFFICIENT_DATA));

        return;
    }

    if (!REGEX.URL.test(link)) {
        res.json(wrapResponseError(ERROR_CODES.NO_CHERRY_ON_THE_CAKE));

        return;
    }

    if (!REGEX.URL.test(cv)) {
        res.json(wrapResponseError(ERROR_CODES.NO_CREAM_ON_THE_CAKE));

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
            const candidate = new CandidateModel({name, skype, cv, result: {link}});

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
