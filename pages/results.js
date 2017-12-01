module.exports = function (params) {
    return (
`<!DOCTYPE html>
<html lang="ru">
    <head>
        <title>${params.title}</title>
        <link rel="shortcut icon" href="/assets/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <link rel="stylesheet" href="/assets/style.css" media="screen" />
        <link rel="stylesheet" href="/assets/media.css" />
    </head>
    <body>
        <div class="ll-page">
            <div class="ll-header"></div>
            <div class="ll-content">
                <h2>Ответы кандидата ${params.name}</h2>
                <p>
                    Правильных ответов: <strong>${params.correctCount}</strong> из <strong>${params.totalCount}</strong>,
                    результат: <strong>${parseFloat((params.correctCount * 100) / params.totalCount).toFixed(2).replace(/\.00$/, '')}%</strong>
                </p>
                ${params.results.map((result, index) => {
                    return (
`<div class="ll-answer ll-answer__m-${!!result.candidateAnswer ? 'incorrect' : 'correct'} ll-answer__m-${result.relation}">
    <div class="ll-answer__number g-no-print">${index + 1}</div>
    <div class="ll-answer__question">
        <div class="ll-answer__question__text">${result.text}</div>
        ${!!result.expression ? `<code class="ll-code-block">${result.expression}</code>` : ''}
        <div class="ll-answer__question__answer ll-answer__question__answer__m-correct">
            <strong>Правильный ответ</strong>: ${result.correctAnswer}
        </div>
        ${!!result.candidateAnswer ? (
`<div class="ll-answer__question__answer ll-answer__question__answer__m-incorrect">
    <strong>Ответ кандидата</strong>: ${result.candidateAnswer}
</div>`
        ) : ''}
    </div>
</div>`
                    );
                }).join('<hr class="g-block-only-print"/>')}
                
                ${!!params.comment ? (
`<h2>Комментарий кандидата</h2>

<blockquote class="ll-quote">${params.comment}</blockquote>
`
                ) : ''}
            </div>
        </div>
    </body>
</html>`
    );
};
