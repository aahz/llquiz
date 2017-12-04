const argv = require('yargs')
    .env('LLQUIZ')
    .option('database', {
        alias: 'd',
        type: 'string',
        description: 'Set MongoDB connection URL',
        demand: true,
    })
    .option('token', {
        alias: 't',
        type: 'string',
        description: 'Set Slack Bot API token for new candidates notifications',
        demand: true,
    })
    .option('channel', {
        alias: 'c',
        type: 'string',
        description: 'Set Slack Bot destination channel id',
        demand: true,
    })
    .option('url', {
        alias: 'u',
        type: 'string',
        description: 'Set server url for results link creation',
        default: '/',
    })
    .help()
    .argv;

module.exports = argv;