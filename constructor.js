function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const INGREDIENTS = {
    proteins: ['meat'],
    fats: ['cucumber'],
    carbs: ['sugar'],
    crispy: ['chips'],
    soft: ['calmar']
},
INGREDIENTS_LOCALES = {
    proteins: 'Белки',
    fats: 'Жиры',
    carbs: 'Углеводы',
    crispy: 'Хрустящее',
    soft: 'Нежное'
},
COLORS = {
    meat: 0xff0000,
    cucumber: 0x00ff00,
    sugar: 0xbbbbbb,
    chips: 0xfffb00,
    calmar: 0xfffbfb
},
MIN_COUNT = 3,
MAX_COUNT = 20,
BASE_CALS = 1000;

export default class {
    #_stats = {
        cals: 0,
        fats: 0,
        carbs: 0,
        proteins: 0
    };

    constructor () {
        this.#_initRandom();
    };

    init() {
        let result = +(window.prompt('ENTER CALS YOU WANT', BASE_CALS) || BASE_CALS);

        console.log(result);

        if(isNaN(result)) result = BASE_CALS;

        document.getElementById('cals_bar').style.width = '50%';

        document.getElementById('cals_text').innerText = `${result} kcal`;
    };

    localeIngredient(type) {
        return INGREDIENTS_LOCALES[type];
    };

    getIngredients() {
        return INGREDIENTS;
    };

    #_initRandom() {
        Object.keys(INGREDIENTS).map(ingredient => {
            const type = INGREDIENTS[ingredient].pop();

            for (let i = randomInteger(MIN_COUNT, MAX_COUNT); i > 0; i--) INGREDIENTS[ingredient].push({
                type,
                color: COLORS[type],
                cals: randomInteger(10, 100),
                fats: randomInteger(10, 30),
                carbs: randomInteger(10, 50),
                proteins: randomInteger(10, 100)
            });
        });
    };
};