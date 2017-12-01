const ERROR_CODES = require('./error-codes');

module.exports = {
    [ERROR_CODES.SOMETHING_WRONG_IN_THE_JUNGLE]: 'Произошла внутренняя ошибка на сервере',
    [ERROR_CODES.INSUFFICIENT_DATA]: 'Не предоставлены все необходимые данные для выполнения запроса',
    [ERROR_CODES.WHO_ARE_YOU]: 'Не найден запрошенный идетификатор пользователя',
    [ERROR_CODES.NO_SECOND_CHANCE]: 'Зарегистрированна попытка повторного прохождения теста в режиме отправки результата',
    [ERROR_CODES.NO_CHERRY_ON_THE_CAKE]: 'Невилидная ссылка на репозитория с исходным кодом тестового задания',
    [ERROR_CODES.NO_CREAM_ON_THE_CAKE]: 'Невилидная ссылка на резюме',
    [ERROR_CODES.ANONYMOUS_FOUND]: 'Невалидный адрес электронной почты',
    [ERROR_CODES.EENY_MEENY_MINY_MOE]: 'Количество ответов не совпадает с количеством вопросов',
    [ERROR_CODES.RAMBLING]: 'Некорректное содержание объекта с ответами',
    [ERROR_CODES.NOT_FAST_ENOUGH]: 'Ответ вышел за рамки временного ограничения',
    [ERROR_CODES.SEE_NO_EVIL]: 'Ни одно из опциональных полей обратой связи не заполнено',
    [ERROR_CODES.TOO_MANY_CHOCOLATES]: 'Превышены лимиты полей обратной связи',
};
