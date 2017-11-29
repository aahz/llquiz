const packageData = require('../package.json');

function printJSON(data, spaces = 2) {
    return JSON.stringify(data, null, spaces);
}

function printCodeBlock(data, isExample = true) {
    const classes = ['ll-code-block'];

    if (isExample) {
        classes.push('ll-code-block__m-example');
    }

    return `<code class="${classes.join(' ')}">${data}</code>`;
}

function printJSONCodeBlock(data, isExample) {
    return printCodeBlock(printJSON(data), isExample);
}

function printRequestHeader(request) {
    return `<h3 id="${request.link.replace(/^#/, '')}">${request.type} ${request.text}</h3>`;
}

function printRequestLink(request) {
    return `<a class="ll-nowrap" href="${request.link}" title="${request.type} ${request.text}">${request.text}</a>`;
}

function printExplanationList(dataObject) {
    const listItems = [];

    for (value in dataObject) {
        if (!dataObject.hasOwnProperty(value)) {
            continue;
        }

        listItems.push(`<li><span class="ll-code">${value}</span> &mdash; ${dataObject[value]}</li>`);
    }

    return (
        `<ul class="ll-list">${listItems.join('')}</ul>`
    )
}

const ERROR_CODES = require('../constants/error-codes');

const REQUESTS = {
    START: {
        type: 'POST',
        text: '/start',
        link: '#post-start',
    },
    GET_QUESTIONS: {
        type: 'POST',
        text: '/getQuestions',
        link: '#post-get-questions',
    },
    COMPLETE: {
        type: 'POST',
        text: '/complete',
        link: '#post-complete',
    },
    FEEDBACK: {
        type: 'POST',
        text: '/feedback',
        link: '#post-feedback',
    }
};

module.exports = (
`<!DOCTYPE html>
<html>
    <head>
        <title>${packageData.name}@${packageData.version} :: ${packageData.description}</title>
        <link rel="shortcut icon" href="/assets/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <link rel="stylesheet" href="/assets/style.css" media="screen" />
        <link rel="stylesheet" href="/assets/media.css" />
    </head>
    <body>
        <div class="ll-page">
            <div class="ll-header"></div>
            <div class="ll-content">
                <h1 class="ll-title">
                    <span class="g-no-print ll-title__random">Lingualeo</span>
                    <span class="g-text-only-print">Тестовое задание</span>
                </h1>
                
                <h2 class="g-no-print">Для тех, кто уже все видел и хочет сразу десерт</h2>
                
                <ul class="g-no-print ll-list ll-list__m-inline">
                    ${Object.values(REQUESTS).map(request => (`<li>${printRequestLink(request)}</li>`)).join('')}
                </ul>
                
                <h2 class="g-no-print">Что это и с чем едят?</h2>
                
                <p>Это тестовое задание команды <a href="https://lingualeo.com/" target="_blank">Lingualeo</a> на должность <strong class="ll-nowrap">Frontend-разработчика</strong>. Мы рады, что ты согласился его выполнить и сейчас расскажем, что мы хотим увидеть в результате его выполнения и немного о том, что и как мы будем проверять ;)</p>
                
                <p>Тестовое задание небольшое и, надеемся, интересное. <span class="g-no-print">Все до безобразия просто: текущий адрес есть ни что иное, как точка входа в простенькое API для теста на знание JS.</span> А задание сводится к тому, что нужно, прочитав описание к <span class="g-no-print">этому</span> API, набросать клиент, который будет красиво выводить вопросы по одному с ограничением по времени прохождения всего теста, которое вернется в результате запроса ${printRequestLink(REQUESTS.START)}, потом на них ответить, а в конце приложить к ответу ${printRequestLink(REQUESTS.COMPLETE)} ссылку на репозиторий с исходниками клиента. Результат запроса ${printRequestLink(REQUESTS.GET_QUESTIONS)} с вопросами для тестирования не содержит указаний на то, какой ответ правильный, а какой нет (то есть в течении теста не нужно проверять правильно ли ответил пользователь или нет), эту информацию мы пришлем только в ответ на запрос ${printRequestLink(REQUESTS.COMPLETE)}. В конце, опционально, можно попросить обратную связь с помощью запроса <span class="ll-nowrap">${printRequestLink(REQUESTS.FEEDBACK)}.</span></p>
                
                <p>Сейчас еще немного графомании и ниже будет описание API, терпение. По результатам этого тестового задания мы еще разок пообщаемся с тобой в формате Skype-беседы, где сначала мы поспрашиваем тебя самые, на наш взгляд, интересные штуки, а потом дадим время тебе позадавать нам все вопросы, которые придут в голову. И если так выйдет, что тебе понравятся наши ответы, а нам твои — последний этап, на котором мы пригласим тебя пообщаться с командой в офис уже на менее специфические темы. Просто познакомиться вживую. Короче, мы все дружно сядем в кружок и просто будем болтать о музыке, кинигах, кино, личном опыте и отношении к работе и отдыху (мы тут типа уважаем ценности друг друга, все дела, прогресс и непринужденность, котики рулят интернетом…).</p>
                
                <h2>Теперь о главном блюде</h2>
                
                <p>Ниже предоставлена документация по взаимодействию с API. Задача: написать клиент для проведения тестирования. В обязательные условия входит сделать клиент максимально соответствующим здравому смыслу и описанному ниже API, все остальное, будь то: дизайнерские шрифты, блоки, кружащиейся в залихвацком анимационном танце, сложные валидации или прочие навороты мы с удовольствием оценим, но их отсутствие не расценивается нами как &laquo;плохое исполнение&raquo; или что-то в этом роде. Хотя есть и &laquo;но&raquo;: если вы взялись добавить что-то от себя, то желательно быть уверенным, что основной функционал работает корректно. Иными словами, инициатива в выполнении приветствуется не в ущерб заданию ;)</p>
                
                <p>Все запросы/ответы в формате JSON.</p>
                
                <p>Ответ всегда содержит два поля: <span class="ll-code">[(Object|Array)] data</span> для передачи информации по результатам запроса и <span class="ll-code">[Boolean] success</span> для указания статуса успешности выполнения запроса. Пример ответа на любой из перечисленных ниже запросов:</p>
                
                ${printCodeBlock(
                    `{\n  "data": ({}|[]), // ответ сервера\n  "success": (true|false) // статус успешности обработки запроса\n}`, 
                    false
                )}
                
                <p>Все ответы от API будут со статусом <span class="ll-code">200 OK</span>, результат запроса определяется значением, переданным в поле <span class="ll-code">[Boolean] success</span>. Если вы получили ошибочный статус от сервера, значит что-то пошло не по плану.</p>
                
                <dl class="ll-api-list">
                
                    <dt>${printRequestHeader(REQUESTS.START)}</dt>
                    <dd>
                        <p>Запрос на начало прохождения теста. При передаче параметра <span class="ll-code">isFinalAttempt: true</span> API начнет отдавать настоящие вопросы и запишет в конце результат прохождения. <strong>Не передавай данный параметр</strong> до тех пор, пока не готов завершить выполнение задания, поскольку повторно пройти тест нельзя. При значении поля <span class="ll-code">isFinalAttempt</span>, приравнивающемся к <span class="ll-code">false</span>, проходить задания можно хоть <span class="ll-nowrap ll-easter-egg">&laquo;до посинения&raquo;<img class="g-no-print ll-easter-egg__image" alt="easter-egg" src="/assets/easter-egg.gif" /></span>, задания и варианты ответов будут представлять из себя слабо связанную с реальностью &laquo;рыбу&raquo;, а ответы, которые сервер будет распознавать как корректные, в тексте будут помечаны символом <span class="ll-code">+</span> в начале.</p>
                        
                        <h4>Параметры</h4>
                        
                        ${printExplanationList({
                            '[String] name': 'имя кандидата',
                            '[String] skype': 'идентификатор Skype для следующего тура',
                            '[?Boolean] isFinalAttempt': 'является ли данная попытка зачетной',
                        })}
                        
                        ${printJSONCodeBlock(
                            {
                                name: 'Ashley James Williams',
                                skype: 'bruceCampbell_58',
                                isFinalAttempt: true,
                            }
                        )}
                        
                        <h4>Ответ</h4>
                        
                        ${printExplanationList({
                            '[Object] data': 'ответ сервера',
                            '[String] data.id': 'идентификатор пользователя для использования в последующих запросах',
                            '[Boolean] success': 'статус успешности обработки запроса',
                        })}

                        ${printJSONCodeBlock(
                            {
                                data: {
                                    id: '123456789abcdef',
                                },
                                success: true,
                            }
                        )}
                        
                        <h4>Ошибки</h4>
                        
                        ${printExplanationList({
                            '[Object] data': 'ответ сервера',
                            '[String] data.code': 'код ошибки',
                            '[String] data.message': 'стандартное сообщение',
                            '[Boolean] success': 'статус успешности обработки запроса',
                        })}
                        
                        <h5>Возможные коды ошибок</h5>
                        
                        ${printExplanationList({
                            [ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE]: 'произошла внутренняя ошибка на сервере',
                            [ERROR_CODES.INSUFFICIENT_DATA]: 'не предаставленны все необходимые данные для начала тестирования',
                            [ERROR_CODES.NO_SECOND_CHANCE]: 'попытка повторного прохождения теста в режиме отправки результата (только для <span class="ll-code">isFinalAttempt === true</span>)',
                        })}
                        
                        ${printJSONCodeBlock(
                            {
                                data: {
                                    code: "insufficient_data",
                                    message: "Не предаставленны все необходимые данные для начала тестирования"
                                },
                                success: false,
                            }
                        )}
                    </dd>
                    
                    <dt>${printRequestHeader(REQUESTS.GET_QUESTIONS)}</dt>
                    <dd>
                        <p>Запрос списка заданий для прохождения. Начиная с этого запроса на сервере пойдет отсчет времени на выполнение задания.</p>
                        
                        <h4>Параметры</h4>
                        
                        ${printExplanationList({
                            '[String] id': 'идентификатор пользователя',
                        })}
                        
                        ${printJSONCodeBlock(
                            {
                                id: '123456789abcdef',
                            }
                        )}
                        
                        <h4>Ответ</h4>
                        
                        ${printExplanationList({
                            '[Array&lt;Object&gt;] data': 'ответ сервера',
                            '[Number] data.restriction': 'количество времени в милисекундах для прохождения теста',
                            '[Array&lt;Object&gt;] data.questions': 'массив вопросов',
                            '[String] data.questions[].id': 'идентификатор вопроса',
                            '[String] data.questions[].text': 'текст вопроса',
                            '[(String|Null)] data.questions[].expression': 'сопутствующий код для вопроса, если таковой подразумевается в вопросе',
                            '[Array&lt;Object&gt;] data.questions[].variants': 'варианты ответа',
                            '[String] data.questions[].variants[].id': 'идентификатор варианта ответа',
                            '[String] data.questions[].variants[].text': 'текст варианта ответа',
                            '[Boolean] success': 'статус успешности обработки запроса',
                        })}
                        
                        ${printJSONCodeBlock(
                            {
                                data: {
                                    restriction: 180000,
                                    questions: [
                                        {
                                            id: '1a2b3c',
                                            text: 'Что будет выведено в консоли по факту выполнения этого кода?',
                                            expression: 'console.log("Hello, World!")',
                                            variants: [
                                                {id: 'a4b221', text: 'Hello, World!'},
                                                {id: 'b7defa', text: 'Necronomicon'},
                                                {id: 'f778ad', text: 'undefined'},
                                                {id: 'eee501', text: 'NaN'},
                                            ],
                                        },
                                        {
                                            id: '4d5e6f',
                                            text: 'Какой из перечисленных типов объекта в JS не имеет литерального синтаксиса?',
                                            expression: null,
                                            variants: [
                                                {id: 'fac3a2', text: 'Array'},
                                                {id: 'abc399', text: 'Object'},
                                                {id: '3bce55', text: 'Date'},
                                                {id: '6690dd', text: 'Set'},
                                                {id: '4444fc', text: 'String'},
                                            ],
                                        }
                                    ],
                                },
                                success: true,
                            }
                        )}
                        
                        <h4>Ошибки</h4>
                        
                        ${printExplanationList({
                            '[Object] data': 'ответ сервера',
                            '[String] data.code': 'код ошибки',
                            '[String] data.message': 'стандартное сообщение',
                            '[Boolean] success': 'статус успешности обработки запроса',
                        })}
                        
                        <h5>Возможные коды ошибок</h5>
                        
                        ${printExplanationList({
                            [ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE]: 'произошла внутренняя ошибка на сервере',
                            [ERROR_CODES.INSUFFICIENT_DATA]: 'не предаставленны все необходимые данные для получения списка вопросов',
                            [ERROR_CODES.NO_SECOND_CHANCE]: 'попытка повторного прохождения теста в режиме отправки результата (только для <span class="ll-code">isFinalAttempt === true</span>)',
                            [ERROR_CODES.WHO_ARE_YOU]: 'не найден запрошенный идетификатор пользователя',
                        })}
                        
                        ${printJSONCodeBlock(
                            {
                                data: {
                                    code: "insufficient_data",
                                    message: "Не предаставленны все необходимые данные для получения вопроса",
                                },
                                success: false,
                            }
                        )}
                    </dd>
                    
                    <dt>${printRequestHeader(REQUESTS.COMPLETE)}</dt>
                    <dd>
                        <p>Отправка результатов прохождения теста.</p>
                        
                        <h4>Параметры</h4>
                        
                        ${printExplanationList({
                            '[String] id': 'идентификатор пользователя',
                            '[String] email': 'адрес электронной почты для связи',
                            '[String] link': 'ссылка на репозиторий с исходным кодом',
                            '[Object&lt;String, String&gt;] result': 'результат тестирования, где ключом явлется идентификатор вопроса, а значением — идентификатор <strong>выбранного</strong> ответа',
                        })}
                        
                        ${printJSONCodeBlock(
                            {
                                id: '123456789abcdef',
                                email: 'brucecampbell_58@deadites.com',
                                link: 'http://github.com/evildead/ll-task',
                                result: {
                                    '1a2b3c': 'f778ad',
                                    '4d5e6f': '3bce55',
                                },
                            }
                        )}
                        
                        <h4>Ответ</h4>
                        
                        ${printExplanationList({
                            '[Object&lt;String, String&gt;] data': 'ответ сервера, где ключом явлется идентификатор вопроса, а значением — идентификатор <strong>правильного</strong> ответа',
                            '[Boolean] success': 'статус успешности обработки запроса',
                        })}
                        
                        ${printJSONCodeBlock(
                            {
                                data: {
                                    '1a2b3c': 'a4b221',
                                    '4d5e6f': '3bce55',
                                },
                                success: true,
                            }
                        )}
                        
                        <h4>Ошибки</h4>
                        
                        ${printExplanationList({
                            '[Object] data': 'ответ сервера',
                            '[String] data.code': 'код ошибки',
                            '[String] data.message': 'стандартное сообщение',
                            '[Boolean] success': 'статус успешности обработки запроса',
                        })}
                        
                        <h5>Возможные коды ошибок</h5>
                        
                        ${printExplanationList({
                            [ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE]: 'произошла внутренняя ошибка на сервере',
                            [ERROR_CODES.INSUFFICIENT_DATA]: 'не предаставленны все необходимые данные для записи ответа',
                            [ERROR_CODES.NO_SECOND_CHANCE]: 'попытка повторного прохождения теста в режиме отправки результата (только для <span class="ll-code">isFinalAttempt === true</span>)',
                            [ERROR_CODES.WHO_ARE_YOU]: 'не найден запрошенный идетификатор пользователя',
                            [ERROR_CODES.NO_CHERRY_ON_THE_CAKE]: 'невалидная ссылка на репозиторий',
                            [ERROR_CODES.ANONYMOUS_FOUND]: 'невалидный адрес электронной почты',
                            [ERROR_CODES.EENY_MEENY_MINY_MOE]: 'количество ответов не совпадает с количеством вопросов',
                            [ERROR_CODES.RAMBLING]: 'некорректное содержание объекта с ответами',
                            [ERROR_CODES.NOT_FAST_ENOUGH]: 'ответ вышел за рамки временного ограничения',
                        })}
                        
                        ${printJSONCodeBlock(
                            {
                                data: {
                                    code: "eeny_meeny_miny_moe",
                                    message: "Количество ответов не совпадает с количеством вопросов",
                                },
                                success: false,
                            }
                        )}
                    </dd>
                    
                    <dt>${printRequestHeader(REQUESTS.FEEDBACK)}</dt>
                    <dd>
                        <p>Отправка обратной связи о прохождении. Данный этап является опциональным и служит для того, чтобы собрать некую статистику по вопросам и узнать другие моменты, что понравилось, а что нет.</p>
                        
                        <h4>Параметры</h4>
                        
                        ${printExplanationList({
                            '[String] id': 'идентификатор пользователя',
                            '[?Array&lt;String&gt;] liked': 'массив идентификаторов вопросов, которые понравились/показались интересными <span class="ll-nowrap">(до <strong>3</strong> вариантов)</span>',
                            '[?Array&lt;String&gt;] disliked': 'массив идентификаторов вопросов, которые не понравились/показались странными <span class="ll-nowrap">(до <strong>3</strong> вариантов)</span>',
                            '[?String] comment': 'комментарий в свободной форме <span class="ll-nowrap">(до <strong>1000</strong> символов)</span>',
                        })}
                        
                        ${printJSONCodeBlock(
                            {
                                id: '123456789abcdef',
                                liked: ['1a2b3c'],
                                comment: 'That\'s was amazing! It\'s like the best experience in my life!!!',
                            }
                        )}
                        
                        <h4>Ответ</h4>
                        
                        ${printExplanationList({
                            '[Object] data': 'ответ сервера',
                            '[Boolean] success': 'статус успешности обработки запроса',
                        })}
                        
                        ${printJSONCodeBlock(
                            {
                                data: {},
                                success: true,
                            }
                        )}
                        
                        <h4>Ошибки</h4>
                        
                        ${printExplanationList({
                            '[Object] data': 'ответ сервера',
                            '[String] data.code': 'код ошибки',
                            '[String] data.message': 'стандартное сообщение',
                            '[Boolean] success': 'статус успешности обработки запроса',
                        })}
                        
                        <h5>Возможные коды ошибок</h5>
                        
                        ${printExplanationList({
                            [ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE]: 'произошла внутренняя ошибка на сервере',
                            [ERROR_CODES.INSUFFICIENT_DATA]: 'не предаставленны все необходимые данные для отправки обратной связи',
                            [ERROR_CODES.WHO_ARE_YOU]: 'не найден запрошенный идетификатор пользователя',
                            [ERROR_CODES.SEE_NO_EVIL]: 'ни одно из опциональных полей обратой связи не заполнено',
                            [ERROR_CODES.TOO_MANY_CHOCOLATES]: 'превышены лимиты полей',
                        })}
                        
                        ${printJSONCodeBlock(
                            {
                                data: {
                                    code: "insufficient_data",
                                    message: "Не предаставленны все необходимые данные для отправки обратной связи",
                                },
                                success: false,
                            }
                        )}
                    </dd>
                </dl>
            </div>
        </div>
        
        <script src="/assets/scripts.js"></script>
    </body>
</html>`
);