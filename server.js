const packageData = require('./package.json');

const console = require('better-console');

const argv = require('yargs')
    .option('port', {
        alias: 'p',
        type: 'string',
        description: 'Set port for server',
        default: 3000,
    })
    .option('database', {
        alias: 'd',
        type: 'string',
        description: 'Set MongoDB connection URL',
        demand: true,
    })
    .help()
    .argv;

const express = require('express');
const app = express();

const welcomePage = require('./pages/welcome');

app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
    res.send(welcomePage);
});

app.listen(argv.port, () => {
    console.info(`${packageData.name}@${packageData.version} is listening on port ${argv.port}`);
});