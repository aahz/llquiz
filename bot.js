const moment = require('moment');
const SlackBot = require('slackbots');
const trimEnd = require('lodash/trimEnd');

const argv = require('./utils/argv');

const bot = new SlackBot({
    token: argv.token,
    name: 'LLQuiz Notifier',
});

const botStartupPromise = new Promise((resolve, reject) => {
    bot.on('open', resolve);
    bot.on('error', reject);
});

const CHANNEL = argv.channel;
const DATE_FORMAT = 'DD.MM.YYYY, HH:mm:ss';

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

    botStartupPromise
        .then(() => {
            bot.postMessage(CHANNEL, message, {
                icon_emoji: ':bust_in_silhouette:',
            });
        })
        .catch(error => {

        });
}

module.exports = {
    bot,
    botStartupPromise,
    notifyNewCandidate,
};
