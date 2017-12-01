const console = require('better-console');
const moment = require('moment');
const SlackBot = require('slackbots');
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
const CHANNEL_ID = 'G77220AK1';

function notifyNewCandidate(candidate, questions, correctAnswers) {
    const questionsIds = Object.keys(correctAnswers);

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
    message += `Ссылка на выполненное тестовое задание: ${candidate.result.link}\n\n`;
    message += 'Ответы:\n';

    message += questionsIds.map((questionId, index) => {
        let result = '';

        const question = find(questions, question => question.id === questionId);

        if (!question) {
            return null;
        }

        const correctAnswerId = correctAnswers[questionId];
        const candidateAnswerId = candidate.result.answers[questionId];

        result += `${index + 1}. ${question.text}\n`;

        if (question.expression) {
            result += '```\n' + question.expression + '\n```\n';
        }

        result += `> _Правильный ответ_: ${find(question.variants, variant => variant.id === correctAnswerId).text}\n`;

        if (correctAnswerId !== candidateAnswerId) {
            result += `> _Неправильный ответ (ответ пользователя)_: ${find(question.variants, variant => variant.id === candidateAnswerId).text}\n`;
        }

        return result;
    }).join('\n');

    bot.postMessage(CHANNEL_ID, message);
}

module.exports = {
    bot,
    notifyNewCandidate,
};
