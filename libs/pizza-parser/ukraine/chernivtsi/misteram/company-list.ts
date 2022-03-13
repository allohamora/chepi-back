import { capitalize } from 'libs/pizza-parser/utils/string';

export type NormalizeHandler = (value: string) => string;

export interface Normalize {
  title?: NormalizeHandler;
  description?: NormalizeHandler;
}

export interface Category {
  slug: string;
  id: number;
  size: number | null;
  blacklist?: RegExp[];
  remove?: RegExp[];
}

export interface Company {
  slug: string;
  id: number;
  categories: Category[];
  normalize?: Normalize;
}

const removePizzaAndDoubleQuotes = (value: string) => {
  const fixed = value
    .replace(/піца/i, '')
    .replace(/"(.+?)"/, '$1')
    .trim();

  return capitalize(fixed);
};

const pizzaPark: Company = {
  slug: 'pizzapark',
  id: 420,
  categories: [{ id: 4798, size: null, slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
  },
};

// Not available
const panskaVtiha: Company = {
  slug: 'panska-vtiha',
  id: 513,
  categories: [{ id: 6130, size: null, slug: 'pizza', blacklist: [/лаваш/, /хачапурі/] }],
};

const lapasta: Company = {
  slug: 'lapasta',
  id: 3134,
  categories: [{ id: 38384, size: null, slug: 'pizza', remove: [/,?\s+зауважте.+$/u], blacklist: [/фокачча/] }],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title)
        .replace(/ді карне/i, 'Ді Карне')
        .replace(/поло фунгі/i, 'Поло Фунгі')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/табаско/i, 'соус "Табаско"')
        .replace(/соус BBQ/i, 'соус "Барбекю"')
        .replace(/філадельфія/i, 'сир "Філадельфія"')
        .replace(/чері/i, 'помідори чері')
        .trim();

      return capitalize(fixed);
    },
  },
};

const baza: Company = {
  slug: 'baza',
  id: 563,
  categories: [
    { id: 7067, size: 50, slug: 'pizza' },
    { id: 7068, size: 30, slug: 'pizza30' },
  ],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/\./, ',')
        .replace(/«(.+?)»/, '"$1"')
        .replace(/ковбаса Баварська/i, 'ковбаса "Баварська"')
        .replace(/свіжа зелень/i, 'зелень')
        .replace(/фрі/, 'картопля фрі')
        .trim();

      return capitalize(fixed);
    },
  },
};

const picantico: Company = {
  slug: 'picantico',
  id: 1103,
  categories: [
    { id: 13559, size: 50, slug: 'pizza50' },
    { id: 13558, size: 35, slug: 'pizza35' },
  ],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/тісто, /, '')
        .replace(/соус на вибір оберіть з переліку, /i, '')
        .replace(/соус на вибір оберіть зі списку, /i, '')
        .replace(/соус оберіть зі списку, /i, '')
        .replace(/моцарелла/i, 'моцарела')
        .replace(/перець чілі/, 'перець чилі')
        .replace(/сир пармезан/, 'пармезан')
        .trim();

      return capitalize(fixed);
    },
  },
};

const theSad: Company = {
  slug: 'thesad',
  id: 2096,
  categories: [
    { id: 26669, size: null, slug: 'pizza' },
    { id: 32975, size: 50, slug: 'pizza50' },
  ],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title)
        .replace(/марко поло/i, 'Марко Поло')
        .replace(/ді поло/i, 'Ді Поло')
        .replace(/мі аморе/i, 'Мі Аморе')
        .replace(/ді сальмоне/i, 'Ді Сальмоне')
        .replace(/прошуто ді парма/i, 'прошуто Ді Парма')
        .replace(/фрута ді маре/i, 'Фрута Ді Маре')
        .replace(/ді сальмоне/i, 'Ді Сальмоне')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/моцарелла/, 'моцарела')
        .replace(/парма/, 'прошуто "Парма"')
        .replace(/моцарелла буфало/, 'моцарела "Буфало"')
        .replace(/моцарела буффало/, 'моцарела "Буфало"')
        .replace(/соус маринара/, 'соус "Маринара"')
        .replace(/соус песто/, 'соус "Песто"')
        .replace(/соус цезар/, 'соус "Цезар"')
        .replace(/сир фета/, 'фета')
        .replace(/чері/, 'помідори чері')
        .trim();

      return capitalize(fixed);
    },
  },
};

const monopoli: Company = {
  slug: 'monopoli',
  id: 803,
  categories: [{ id: 13020, size: null, slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/помідор/i, 'помідори')
        .replace(/помідории/i, 'помідори')
        .replace(/чері/i, 'помідори чері')
        .replace(/масліни/i, 'маслини')
        .replace(/соус Цезар/i, 'соус "Цезар"')
        .replace(/соус Пелаті/i, 'соус "Пелаті"')
        .replace(/сир тофу/i, 'тофу')
        .replace(/печериці-гриль/i, 'печериці гриль');

      return capitalize(fixed);
    },
  },
};

const kartoteka: Company = {
  slug: 'kartoteka',
  id: 1323,
  categories: [{ id: 16173, size: null, slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/мацарела/i, 'моцарела')
        .replace(/песто власного приготування/i, 'соус "Песто"')
        .replace(/соус чимічуррі/i, 'соус "Чимічуррі"')
        .replace(/томати/i, 'помідори')
        .replace(/(.+?) та (.+?)/i, '$1, $2')
        .trim();

      return capitalize(fixed);
    },
  },
};

const chicheri: Company = {
  slug: 'chicheri',
  id: 448,
  categories: [{ id: 35368, size: 30, slug: 'pizza30' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/руккола/i, 'рукола')
        .replace(/соус пелаті/i, 'соус "Пелаті"')
        .replace(/айзберг/i, 'салат "Айсберг"')
        .replace(/фрі/i, 'картопля фрі')
        .replace(/чілі/i, 'перець чілі')
        .replace(/чері/i, 'помідори чері')
        .replace(/помідори помідори чері/i, 'помідори чері')
        .replace(/едем/i, 'едам');

      return capitalize(fixed);
    },
  },
};

const gorno: Company = {
  slug: 'gorno',
  id: 1338,
  categories: [
    { id: 16461, size: 30, slug: 'pizza30' },
    { id: 16704, size: 50, slug: 'pizza50' },
  ],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/листя міксу/i, 'листя салату')
        .replace(/сир тв./i, 'сир твердий')
        .replace(/соус цезар/i, 'соус "Цезар"')
        .replace(/моцарелла/i, 'моцарела')
        .replace(/томати/i, 'помідори')
        .replace(/ф.куряче/i, 'філе куряче')
        .trim();

      return capitalize(fixed);
    },
  },
};

const bruno: Company = {
  slug: 'bruno',
  id: 669,
  categories: [{ id: 8166, size: null, slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/томатний соус "Пелаті"/i, 'соус "Пелаті"')
        .replace(/соус томатний "Пелаті"/i, 'соус "Пелаті"')
        .replace(/моцарелла/i, 'моцарела')
        .replace(/айсберг/i, 'салат "Айсберг"')
        .replace(/сир фета/i, 'фета')
        .replace(/сир сулугуні/i, 'сулугуні')
        .replace(/сир гауда/i, 'гауда')
        .replace(/\.$/, '');

      return capitalize(fixed);
    },
  },
};

const mamasPizza: Company = {
  slug: 'mamaspizza',
  id: 1026,
  categories: [
    { id: 13687, size: 30, slug: 'pizza30' },
    { id: 13686, size: 50, slug: 'pizza50' },
  ],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/соус на вибір, /i, '')
        .replace(/моцарелла/i, 'моцарела')
        .replace(/ковбаса папероні/i, 'папероні')
        .replace(/чері/i, 'помідори чері')
        .replace(/сир моцарела/i, 'моцарела')
        .replace(/сир Дор-блю/i, 'дорблю')
        .replace(/сир брі/i, 'брі')
        .replace(/сир пармезан/i, 'пармезан')
        .replace(/вершковий соус/i, 'соус вершковий')
        .trim();

      return capitalize(fixed);
    },
  },
};

const riposo: Company = {
  slug: 'riposo',
  id: 635,
  categories: [{ id: 7666, size: 30, slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/моцарела бебі/i, 'моцарела "Бебі"')
        .replace(/соус розмариновий песто/i, 'соус розмариновий "Песто"')
        .replace(/Пармезан/, 'пармезан')
        .replace(/Дор блю/, 'дорблю')
        .replace(/\./gi, ',')
        .trim();

      return capitalize(fixed);
    },
  },
};

const chebonta: Company = {
  slug: 'chebonta',
  id: 2754,
  categories: [
    { id: 34248, size: 50, slug: 'pizza50' },
    { id: 34245, size: 35, slug: 'pizza35' },
  ],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/сир пармезан/i, 'пармезан')
        .replace(/томати/i, 'помідори')
        .replace('соус на вибір (оберіть з переліку), ', '')
        .replace('Соус на вибір (оберіть з переліку), ', '')
        .trim();

      return capitalize(fixed);
    },
  },
};

const terassa: Company = {
  slug: 'terassa',
  id: 1124,
  categories: [{ id: 42425, size: 30, slug: 'pizza30' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/\//gi, ', ')
        .replace(/чері/i, 'помідори чері')
        .replace(/ементалер/i, 'емменталь')
        .replace(/дорблю/i, 'дорблю')
        .replace(/Перець пепероні/, 'перець пепероні')
        .replace(/Моцарела/, 'моцарела');

      return capitalize(fixed);
    },
  },
};

const kucheri: Company = {
  slug: 'kucheri',
  id: 1111,
  categories: [{ id: 14047, size: 30, slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/соус пелаті/i, 'соус "Пелаті"')
        .replace(/перець Чилі/i, 'перець чилі')
        .replace(/картопля "ФРІ"/i, 'картопля фрі')
        .replace(/едем/i, 'едам')
        .replace(/айзберг/i, 'салат "Айсберг"')
        .replace(/козиний сир/i, 'козячий сир');

      return capitalize(fixed);
    },
  },
};

const ciabatta: Company = {
  slug: 'ciabatta',
  id: 1069,
  categories: [{ id: 13168, size: 30, slug: 'pizza' }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/мисл.ковбаски/i, 'мисливські ковбаски')
        .replace(/тісто(, )?/i, '')
        .trim();

      return capitalize(fixed);
    },
  },
};

const diverso: Company = {
  slug: 'diverso',
  id: 3076,
  categories: [{ id: 37363, size: null, slug: 'pizzaburgers', blacklist: [/бургер/] }],
  normalize: {
    title: (title) => {
      const fixed = removePizzaAndDoubleQuotes(title)
        .replace(/«(.+?)»/, '"$1"')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/сири? моцарела/i, 'моцарела')
        .replace(/базилік свіжий/, 'базилік')
        .replace(/(.+?) та (.+?)/, '$1, $2')
        .replace(/соус цезар/i, 'соус "Цезар"')
        .trim();

      return capitalize(fixed);
    },
  },
};

const yourPizza: Company = {
  slug: 'yourpizza',
  id: 3034,
  categories: [
    { id: 36919, size: 20, slug: 'pizza20' },
    { id: 36916, size: 30, slug: 'pizza30' },
    { id: 36913, size: 50, slug: 'pizza50' },
  ],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/дор-блю/, 'дорблю')
        .replace(/королівський/, 'сир королівський')
        .replace(/Сир сир королівський/i, 'сир королівський')
        .replace(/соус Цезар/i, 'соус "Цезар"')
        .replace(/основа(, )?/i, '')
        .replace(/масліни/, 'маслини')
        .trim();

      return capitalize(fixed);
    },
  },
};

// Not available
const familyBakeryPizza: Company = {
  slug: 'familybakerypizza',
  id: 3022,
  categories: [
    { id: 36766, size: 30, slug: 'pizza30', remove: [/ ?Ø30/] },
    { id: 36850, size: 40, slug: 'pizza40', remove: [/ ?Ø40/] },
  ],
};

const aveCeasare: Company = {
  slug: 'aveceasare',
  id: 2633,
  categories: [{ id: 32894, size: 30, slug: 'pizza30' }],
  normalize: {
    title: (title) => {
      const fixed = title
        .replace(/піца/i, '')
        .replace(/«(.+?)»/, '$1')
        .replace(/“(.+?)”/, '"$1"')
        .trim();

      return capitalize(fixed);
    },
    description: (description) => {
      const fixed = description
        .replace(/тісто з італійського борошна вищого ґатунку, /i, '')
        .replace(/Тісто з борошна вищого ґатунку, /i, '')
        .replace(/соус томатний згідно справжнього італійського рецепту/i, 'соус томатний')
        .replace(/качина грудка власного копчення/i, 'копчена качина грудка')
        .replace(/балик власного копчення/i, 'копчений балик')
        .replace(/баклажан у фритюрі з часником та орегано/i, 'баклажан у фритюрі, часник, орегано')
        .replace(/ковбаски власного приготування/i, 'ковбаски')
        .replace(/бекон власного копчення/i, 'копчений бекон')
        .replace(/вершковий соус з крем-сиром/i, 'вершковий соус')
        .replace(/сир Філадельфія/i, 'сир "Філадельфія"')
        .replace(/сир Моцарела/i, 'моцарела')
        .replace(/сир Пармезан/i, 'пармезан')
        .replace(/сир Горгонзола/i, 'горгонзола')
        .replace(/сир Фета/i, 'фета')
        .replace(/домашній твердий сир/i, 'сир твердий')
        .replace(/томати/, 'помідори')
        .replace(/солодкий маринований перець Пеперончіно/i, 'солодкий маринований перець "Пеперончіно"')
        .replace(/ ,/, ',')
        .trim();

      return capitalize(fixed);
    },
  },
};

const pastamia: Company = {
  slug: 'pastamia',
  id: 2255,
  categories: [{ id: 28784, size: null, slug: 'pizza', blacklist: [/пінца/] }],
  normalize: {
    title: removePizzaAndDoubleQuotes,
    description: (description) => {
      const fixed = description
        .replace(/томати/i, 'помідори')
        .replace(/салямі наполі,? піканте/i, 'салямі "Наполі Піканте"')
        .trim();

      return capitalize(fixed);
    },
  },
};

export const COMPANY_LIST: Company[] = [
  pizzaPark,
  panskaVtiha,
  lapasta,
  baza,
  picantico,
  theSad,
  monopoli,
  kartoteka,
  chicheri,
  gorno,
  bruno,
  mamasPizza,
  riposo,
  chebonta,
  terassa,
  kucheri,
  ciabatta,
  diverso,
  yourPizza,
  familyBakeryPizza,
  aveCeasare,
  pastamia,
];
