const get = require('lodash/get');

const ERROR_MESSAGES = require('../constants/error-messages');

function wrapResponse(data, success) {
    return {data, success};
}

module.exports = {
    wrapResponseSuccess: function (data = {}) {
        return wrapResponse(data, true);
    },
    wrapResponseError: function (code, message) {
        return wrapResponse({code, message: message || get(ERROR_MESSAGES, code, code)}, false);
    }
};
