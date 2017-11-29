const faker = require('faker');
const times = require('lodash/times');
const upperFirst = require('lodash/capitalize');
const sample = require('lodash/sample');

const {MOCK_NUMBER} = require('../constants/restrictions');
const {getMockId} = require('../utils/mock');

const CODE_EXAMPLES = [
`Boolean b = new Boolean( is_admin );

if( b.toString().length() == 4 ) {
   // something...
}

// something`,
`function myFunction(arg) {
    var configObj = {
        option1: 123,
        option2: 456
    };

    // do stuff
}`,
`do if (parent.nodeName.toLowerCase() === 'div') break; while (parent = parent.parentNode);`,
`for (var i = 0; i < 100; ++i) {
    elementInDocument.appendChild(document.createElement('div'));
}`,
];

module.exports = times(MOCK_NUMBER, function () {
    const result = {
        id: getMockId(),
        text: faker.lorem.sentences(),
        variants: times(faker.random.number({min: 2, max: 8}), function (i) {
            const isCorrect = i === 1;

            return {
                id: getMockId(),
                text: (isCorrect ? '+ ' : '') + upperFirst(faker.lorem.words(faker.random.number({min: 1, max: 5}))),
                isCorrect,
            };
        }),
    };

    if (Math.round(Math.random())) {
        result.expression = sample(CODE_EXAMPLES);
    }
    else {
        result.expression = null;
    }

    return result;
});