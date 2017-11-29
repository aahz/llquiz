'use strict';

require('colors');

const console = require('better-console');
const prompt = require('prompt');
const mongoose = require('mongoose');
const isEmpty = require('lodash/isEmpty');

const {QuestionModel} = require('../models/question');

const argv = require('yargs')
    .option('database', {
        alias: 'd',
        type: 'string',
        description: 'Set MongoDB connection URL',
        demand: true,
    })
    .help()
    .argv;

const YES = 'yes';
const NO = 'no';

const CORRECT_REGEX = /^\+\+\+\s*/;

const schema = {
    properties: {
        text: {
            type: 'string',
            description: "Question text",
            message: 'Question text is required.',
            required: true,
        },
        expression: {
            type: 'string',
            description: "Code (leave blank if not applicable to the question)",
        },
        variants: {
            type: 'array',
            description: "Answer variants",
            minItems: 2,
            before: function (value) {
                if (value.length === 0) {
                    return value;
                }

                const valueText = value[value.length - 1];

                variants.push({
                    text: valueText.replace(CORRECT_REGEX, ''),
                    isCorrect: CORRECT_REGEX.test(valueText),
                });

                return value;
            }
        }
    },
};

prompt.message = '';
prompt.delimiter = ':';

const results = [];
let variants = [];

function start() {
    prompt.start();

    return new Promise((resolve, reject) => {
        prompt.get(schema, (error, result) => {
            if (error) {
                reject(error);

                return;
            }

            resolve(result);
        });
    })
        .then(result => {
            result.variants = [...variants];
            variants = [];

            if (isEmpty(result.expression)) {
                result.expression = null;
            }

            if (result.variants.every(({isCorrect}) => !isCorrect)) {
                result.variants[0].isCorrect = true;
            }

            let correctAnswersFound = 0;

            result.variants.forEach(variant => {
                correctAnswersFound += (variant.isCorrect ? 1 : 0);
            });

            if (correctAnswersFound === 0) {
                result.variants[0].isCorrect = true;

                correctAnswersFound = 1;
            }

            if (correctAnswersFound === 1) {
                results.push(result);
            }
            else {
                console.warn('Question variants are invalid and the question itself will not be added to DB.');
            }

            prompt.start();

            return new Promise((resolve, reject) => {
                prompt.get({
                    name: 'addAnother',
                    type: 'string',
                    description: 'Do you want to add another question?',
                    lowercase: true,
                    default: NO,
                }, (error, result) => {
                    if (error) {
                        reject(error);

                        return;
                    }

                    resolve(result.addAnother);
                });
            });
        })
        .then(addAnother => {
            if (addAnother === YES) {
                start();

                return;
            }

            push(results);
        })
        .catch(error => {
            if (error.message === 'canceled') {
                console.info('…canceled by user');

                process.exit(0);
            }

            console.error(error.message || error.toString());

            process.exit(1);
        });
}

function push(results) {
    console.info('This questions are prepared to be inserted to DB:');
    console.log(JSON.stringify(results, null, 2));

    prompt.start();

    prompt.get({
        name: 'shouldInsert',
        type: 'string',
        description: 'Approve this',
        lowercase: true,
        default: NO,
    }, (error, result) => {
        if (error) {
            if (error.message === 'canceled') {
                console.info('…canceled by user');

                process.exit(0);
            }

            console.error(error.message || error.toString());

            process.exit(1);
        }

        if (result.shouldInsert !== YES) {
            console.warn('Permission not granted! Canceled.')

            process.exit(0);
        }

        mongoose.Promise = global.Promise;
        mongoose.connect(argv.database, {
            useMongoClient: true,
            autoReconnect: true,
            reconnectTries: 10,
            promiseLibrary: global.Promise,
        })
            .then(
                () => {
                    QuestionModel.insertMany(results)
                        .then(() => {
                            console.log('Complete!'.green);

                            process.exit(0);
                        })
                        .catch(error => {
                            console.error(error.message || error.toString());

                            process.exit(1);
                        })
                },
                error => {
                    console.error('DB connection failed.', error.message || error.toString())
                }
            );
    });
}

console.log(
    'Please input questions and answer variants.\n' +
    'For marking correct answers use "+++" mark in the very beginning of answer text ' +
    'or use no marks and pass the correct answer as the first variant.\n'
);

start();
