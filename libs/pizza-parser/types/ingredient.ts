export enum Ingredient {
  pizzaBase = 'pizzaBase',
  dough = 'dough',

  sauce = 'sauce',
  pestoSauce = 'pestoSauce',
  tomatoOrCreamSauce = 'tomatoOrCreamSauce',
  tomatoSauce = 'tomatoSauce',
  homemadeTomatoSauce = 'homemadeTomatoSauce',
  caesarSauce = 'caesarSauce',
  greenSauce = 'greenSauce',
  creamSauce = 'creamSauce',

  bacon = 'bacon',
  ham = 'ham',
  chicken = 'chicken',
  bakedChickenFillet = 'bakedChickenFillet',
  chickenFillet = 'chickenFillet',
  prosciutto = 'prosciutto',
  mincedSalsa = 'mincedSalsa',
  huntingSausages = 'huntingSausages',

  salami = 'salami',
  spicySalami = 'spicySalami',
  piquantSalami = 'piquantSalami',

  cheese = 'cheese',
  creamCheese = 'creamCheese',
  mozzarellaFresca = 'mozzarellaFresca',
  mozzarella = 'mozzarella',
  parmesan = 'parmesan',
  feta = 'feta',
  gorgonzola = 'gorgonzola',
  radomer = 'radomer',

  salad = 'salad',
  saladMix = 'saladMix',

  herb = 'herb',
  corn = 'corn',
  grilledEggplant = 'grilledEggplant',
  artichokes = 'artichokes',
  pear = 'pear',
  pineapple = 'pineapple',
  blackOlives = 'blackOlives',
  greenOlives = 'greenOlives',
  capers = 'capers',
  basil = 'basil',

  tomatoes = 'tomatoes',
  cherryTomatoConfit = 'cherryTomatoConfit',
  cherryTomatoes = 'cherryTomatoes',

  pepper = 'pepper',
  pepperoniPepper = 'pepperoniPepper',
  chiliPepper = 'chiliPepper',
  bellPepper = 'bellPepper',

  mushrooms = 'mushrooms',
  freshMushrooms = 'freshMushrooms',

  seafood = 'seafood',
  shrimps = 'shrimps',
  mussels = 'mussels',

  honey = 'honey',
}

/* eslint-disable */
// prettier-ignore
export const UkToIngredient: Record<string, Ingredient> = {
  'основа': Ingredient.pizzaBase,
  'тісто': Ingredient.dough,

  'соус': Ingredient.sauce,
  'соус песто': Ingredient.pestoSauce,
  'соус(томатний/вершковий)': Ingredient.tomatoOrCreamSauce,
  'томатний соус': Ingredient.tomatoSauce,
  'домашній томатний соус': Ingredient.homemadeTomatoSauce,
  'соус цезаре': Ingredient.caesarSauce,
  'зелений соус': Ingredient.greenSauce,
  'вершковий соус': Ingredient.creamSauce,

  'бекон': Ingredient.bacon,
  'шинка': Ingredient.ham,
  'курка': Ingredient.chicken,
  'куряче філе': Ingredient.chickenFillet,
  'куряче філе печене': Ingredient.bakedChickenFillet,
  'м’ясний фарш сальсіча': Ingredient.mincedSalsa,
  'прошуто': Ingredient.prosciutto,
  'мисливські ковбаски': Ingredient.huntingSausages,

  'салямі': Ingredient.salami,
  'салямі пікантне': Ingredient.piquantSalami,
  'салямі піканте': Ingredient.piquantSalami,
  'гостре салямі': Ingredient.spicySalami,

  'сир': Ingredient.cheese,
  'крем-сир': Ingredient.creamCheese,
  'сир мацарелла': Ingredient.mozzarella,
  'сир моцарелла': Ingredient.mozzarella,
  'сир моцарела': Ingredient.mozzarella,
  'моцарела фреска': Ingredient.mozzarellaFresca,
  'моцарела': Ingredient.mozzarella,
  'сир пармезан': Ingredient.parmesan,
  'сири пармезан': Ingredient.parmesan,
  'пармезан': Ingredient.parmesan,
  'сир фета': Ingredient.feta,
  'фета': Ingredient.feta,
  'сири горгонзола': Ingredient.gorgonzola,
  'горгонзола': Ingredient.gorgonzola,
  'радомер': Ingredient.radomer,

  'салат': Ingredient.salad,
  'мікс-салат': Ingredient.saladMix,
  'салат мікс': Ingredient.saladMix,

  'зелень': Ingredient.herb,
  'кукурудза': Ingredient.corn,
  'баклажани гриль': Ingredient.grilledEggplant,
  'артишоки': Ingredient.artichokes,
  'груша': Ingredient.pear,
  'ананаси': Ingredient.pineapple,
  'ананас': Ingredient.pineapple,
  'оливки': Ingredient.greenOlives,
  'маслини': Ingredient.blackOlives,
  'каперси': Ingredient.capers,
  'базилік': Ingredient.basil,

  'помідора': Ingredient.tomatoes,
  'помідори': Ingredient.tomatoes,
  'конфі з помідорів чері': Ingredient.cherryTomatoConfit,
  'помідори чері': Ingredient.cherryTomatoes,

  'перець': Ingredient.pepper,
  'перець пепероні': Ingredient.pepperoniPepper,
  'перець болгарський': Ingredient.bellPepper,
  'перці болгарський': Ingredient.bellPepper,
  'перець чилі': Ingredient.chiliPepper,
  'чілі': Ingredient.chiliPepper,

  'гриби': Ingredient.mushrooms,
  'печериці': Ingredient.mushrooms,
  'печериці свіжі': Ingredient.freshMushrooms,

  'морепродукти': Ingredient.seafood,
  'креветки': Ingredient.shrimps,
  'мідії': Ingredient.mussels,

  'мед': Ingredient.honey,
};
/* eslint-enable */
