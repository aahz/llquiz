const {getMockId} = require('../utils/mock');
const {TIME_FOR_ONE_QUESTION, MOCK_NUMBER} = require('../constants/restrictions');

module.exports = {
    id: getMockId(),
    restriction: TIME_FOR_ONE_QUESTION * MOCK_NUMBER,
};