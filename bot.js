const console = require('better-console');
const moment = require('moment');
const SlackBot = require('slackbots');
const trimEnd = require('lodash/trimEnd');
const find = require('lodash/find');

const argv = require('./utils/argv');

const bot = new SlackBot({
    token: argv.token,
    name: 'LLQuiz Notifier',
});

bot.on('open', () => {
    console.info("Slack bot is ready to communicate");
});

bot.on('error', error => {
    console.error('Slack bot starting failed', error)
});

const DATE_FORMAT = 'dddd, DD.MM.YYYY, HH:mm:ss';

function notifyNewCandidate(candidate) {
    const startedAt = moment(candidate.result.startedAt);
    const completedAt = moment(candidate.result.completedAt);

    let message = '*Новая заявка на рассмотрение кандидата:*\n\n```\n';
    message += `Идентификатор: ${candidate.id}\n`;
    message += `Имя: ${candidate.name}\n`;
    message += `Электронная почта: ${candidate.email}\n`;
    message += `Skype: ${candidate.skype}\n`;
    message += `Резюме: ${candidate.cv}\n`;
    message += '```\n\n';

    message += '*Результаты:*\n\n';

    message += `Время начала тестирования: ${startedAt.format(DATE_FORMAT)}\n`
    message += `Время окончания тестирования: ${completedAt.format(DATE_FORMAT)}\n`
    message += `Ссылка на репозиторий: ${candidate.result.link}\n`;
    message += `Ответы на вопросы теста: ${trimEnd(argv.url, '/')}/results/${candidate.id}`;

    bot.postMessage(argv.channel, message);
}

module.exports = {
    bot,
    notifyNewCandidate,
};
