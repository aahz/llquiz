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
    .help()
    .argv;

module.exports = argv;