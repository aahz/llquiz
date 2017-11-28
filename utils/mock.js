const faker = require('faker');

module.exports = {
    getMockId: function() {
        return `mock-${faker.random.uuid().replace(/-/g, '')}`;
    },
    isMockId: function(id) {
        return /^mock-[a-f0-9]{32}$/.test(id);
    },
};
