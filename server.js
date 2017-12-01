const packageData = require('./package.json');

const console = require('better-console');
const mongoose = require('mongoose');

const moment = require('moment');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const find = require('lodash/find');

const argv = require('./utils/argv');

const HEADERS = require('./constants/headers');

const errorPageRenderer = require('./pages/error');
const welcomePageRenderer = require('./pages/welcome');
const resultsPageRenderer = require('./pages/results');

const {CandidateModel} = require('./models/candidate');
const {QuestionModel} = require('./models/question');

const API = {
    START: require('./api/start'),
    GET_QUESTIONS: require('./api/get-questions'),
    COMPLETE: require('./api/complete'),
    FEEDBACK: require('./api/feedback'),
};

moment.locale('ru');

const PAGE_TITLE_BASE = `${packageData.name}@${packageData.version}`;

app.use('/assets', express.static('assets'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(welcomePageRenderer({
        title: `${packageData.description} — ${PAGE_TITLE_BASE}`,
        header: HEADERS[Math.floor(Math.random() * HEADERS.length)],
        url: argv.url,
    }));
});

app.get('/results/:id', (req, res) => {
    const candidateId = req.params.id;

    new Promise((resolve, reject) => {
        CandidateModel.findOne({_id: candidateId}).exec((error, candidate) => {
            if (error || !candidate) {
                reject();

                return;
            }

            resolve({candidate});
        });
    })
        .then(({candidate}) => new Promise((resolve, reject) => {
            QuestionModel.find().exec((error, questions) => {
                if (error) {
                    reject();

                    return;
                }

                resolve({candidate, questions});
            });
        }))
        .then(({candidate, questions}) => {
            let totalCount = 0;
            let wrongCount = 0;

            const results = Object.keys(candidate.result.answers).map(questionId => {

                const result = {
                    relation: 'neutral',
                };

                if (candidate.feedback.liked.includes(questionId)) {
                    result.relation = 'positive';
                } else if (candidate.feedback.disliked.includes(questionId)) {
                    result.relation = 'negative';
                }

                const question = find(questions, (question) => question.id === questionId);

                result.text = question.text;

                if (question.expression) {
                    result.expression = question.expression.replace(/\\n/g, '\n');
                }

                const correctVariant = find(question.variants, variant => variant.isCorrect);
                const candidateVariant = find(question.variants, variant => variant.id === candidate.result.answers[questionId]);

                result.correctAnswer = correctVariant.text;

                totalCount += 1;

                if (correctVariant.id !== candidateVariant.id) {
                    result.candidateAnswer = candidateVariant.text;

                    wrongCount += 1;
                }

                return result;
            });

            res.send(resultsPageRenderer({
                title: `Результаты тестирования кандидата ${candidate.name} — ${PAGE_TITLE_BASE}`,
                name: candidate.name,
                link: candidate.result.link,
                comment: candidate.feedback.comment,
                totalCount,
                correctCount: totalCount - wrongCount,
                results,
            }))
        })
        .catch(() => {
            res.status(404).send(errorPageRenderer({
                title: 'Error',
                path: `/results/${candidateId}`
            }));
        });
});

app.post('/start', API.START);
app.post('/getQuestions', API.GET_QUESTIONS);
app.post('/complete', API.COMPLETE);
app.post('/feedback', API.FEEDBACK);

const port = (process.env.PORT || 3000);

mongoose.Promise = global.Promise;

mongoose.connect(argv.database, {
    useMongoClient: true,
    autoReconnect: true,
    reconnectTries: 10,
    promiseLibrary: global.Promise,
}).then(
    () => {
        console.info('Database connection established.');

        app.listen(port, () => {
            console.info(`${packageData.name}@${packageData.version} is listening on port ${port}`);
        });
    },
    error => {
        console.error(error);
    }
);