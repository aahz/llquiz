const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const isError = require('lodash/isError');
const isString = require('lodash/isString');
const isArray = require('lodash/isArray');

const {wrapResponseSuccess, wrapResponseError} = require('../utils/response');
const {isMockId} = require('../utils/mock');
const {MAX_OPINION, MAX_COMMENT} = require('../constants/restrictions');
const ERROR_CODES = require('../constants/error-codes');
const MOCK_START = require('../mock/start');

const {CandidateModel} = require('../models/candidate');

module.exports = function (req, res) {
    const {body} = req;

    const id = get(body, 'id');
    const liked = get(body, 'liked', []);
    const disliked = get(body, 'disliked', []);
    const comment = get(body, 'comment', '');

    if (isEmpty(id) || !isString(id) || !isArray(liked) || !isArray(disliked) || !isString(comment)) {
        res.json(wrapResponseError(ERROR_CODES.INSUFFICIENT_DATA));

        return;
    }

    if (isEmpty(liked) && isEmpty(disliked) && isEmpty(comment)) {
        res.json(wrapResponseError(ERROR_CODES.SEE_NO_EVIL));

        return;
    }

    if (liked.length >= MAX_OPINION || disliked.length >= MAX_OPINION || comment.length >= MAX_COMMENT) {
        res.json(wrapResponseError(ERROR_CODES.TOO_MANY_CHOCOLATES));

        return;
    }

    if (isMockId(id)) {
        if (id !== MOCK_START.id) {
            res.json(wrapResponseError(ERROR_CODES.WHO_ARE_YOU));

            return;
        }

        res.json(wrapResponseSuccess());

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

                candidate.feedback.liked = liked;
                candidate.feedback.disliked = disliked;
                candidate.feedback.comment = comment;

                candidate.save(error => {
                    if (error) {
                        reject(ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE);

                        return;
                    }

                    res.json(wrapResponseSuccess());
                })
            })
    })
        .catch(code => {
            res.json(wrapResponseError(isError(code) ? ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE : code));
        });
};
