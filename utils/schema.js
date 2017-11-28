const omit = require('lodash/omit');

module.exports = {
    toClient: function () {
        const obj = this.toObject({virtuals: true});

        return omit(obj, ['_id', '__v']);
    },
};
