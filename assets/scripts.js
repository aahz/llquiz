(function (window, undefined) {
    'use strict';

    function randomizeTitle(document) {
        var titleTexts = [
            'Hail to the King, baby!',
            'Больше фронтеэнда богу фронтенда!',
            'Это вам не это… Это — это this!',
            'Да тут делов-то: раз, два и ОК',
            'Консоль логировали-логировали, <span class="ll-nowrap">да невылогировали</span>',
            'Раз фрикаделька, два фрикаделька…',
            'Good. Bad. I\'m the guy with the gun!',
            'Waka-waka… Groovy!',
            'Покатай меня, большая черепаха!',
            'Сначала думаю, потом еще раз думаю',
            'Вот скажи мне, американец, в чем сила?',
            'Когда разработчику делать нечего, <span class="ll-nowrap">он код вылизывает…</span>    ',
            'Между c и с разницы никакой… <span class="ll-nowrap">А сколько боли при отладке?..</span>',
            'Мы писали, мы писали, <span class="ll-nowrap">наши пальчики устали…</span>',
            'В начале было слово и слово было <span class="ll-nowrap">"use strict"</span>',
            'Не было печали, апдейтов накачали',
            'Если много <span class="ll-nowrap">пушить —</span> будешь пушистиком',
            'И как же нам с этим быть?',
            '(0x2B || !0x2B)? Вот в чем вопрос',
            'И на это я потратил лучшие коды <span class="ll-nowrap">своей жизни?</span>',
            'Где же эта функция? Ааа, вот она!',
            'Делай! Или не делай! Не надо пытаться',
            'Без пары кофе тут не разобраться…'
        ];

        var titleCollection = document.getElementsByClassName('ll-title__random');

        if (!titleCollection.length) {
            return;
        }

        titleCollection[0].innerHTML = titleTexts[Math.floor(Math.random() * titleTexts.length)];
    }

    window.document.addEventListener('DOMContentLoaded', function () {
        randomizeTitle(window.document);
    });
})(window);