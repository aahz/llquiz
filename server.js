const packageData = require('./package.json');

const console = require('better-console');
const mongoose = require('mongoose');

const moment = require('moment');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const welcomePage = require('./pages/welcome');
const argv = require('./utils/argv');


const API = {
    START: require('./api/start'),
    GET_QUESTIONS: require('./api/get-questions'),
    COMPLETE: require('./api/complete'),
    FEEDBACK: require('./api/feedback'),
};

moment.locale('ru');

app.use('/assets', express.static('assets'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(welcomePage);
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