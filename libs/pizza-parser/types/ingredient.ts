export enum Ingredient {
  dough = 'dough',

  creamSauce = 'creamSauce',
  sauce = 'sauce',

  ham = 'ham',
  chickenFillet = 'chickenFillet',
  prosciutto = 'prosciutto',
  huntingSausages = 'huntingSausages',

  salami = 'salami',
  spicySalami = 'spicySalami',

  cheese = 'cheese',
  mozzarella = 'mozzarella',
  parmesan = 'parmesan',
  feta = 'feta',
  gorgonzola = 'gorgonzola',

  green = 'green',
  pineapple = 'pineapple',
  olives = 'olives',
  capers = 'capers',
  basil = 'basil',

  tomatoes = 'tomatoes',
  cherryTomatoes = 'cherryTomatoes',

  pepper = 'pepper',
  chiliPeppers = 'chiliPeppers',

  mushrooms = 'mushrooms',
  freshMushrooms = 'freshMushrooms',

  seafood = 'seafood',
}

/* eslint-disable */
export const UkToIngredient: Record<string, Ingredient> = {
  'тісто': Ingredient.dough,

  'вершковий соус': Ingredient.creamSauce,
  'соус': Ingredient.sauce,

  'шинка': Ingredient.ham,
  'куряче філе': Ingredient.chickenFillet,
  'прошуто': Ingredient.prosciutto,
  'мисливські ковбаски': Ingredient.huntingSausages,

  'салямі': Ingredient.salami,
  'гостре салямі': Ingredient.spicySalami,

  'сир': Ingredient.cheese,
  'моцарела': Ingredient.mozzarella,
  'пармезан': Ingredient.parmesan,
  'фета': Ingredient.feta,
  'горгонзола': Ingredient.gorgonzola,

  'зелень': Ingredient.green,
  'ананас': Ingredient.pineapple,
  'оливки': Ingredient.olives,
  'каперси': Ingredient.capers,
  'базилік': Ingredient.basil,

  'помідори': Ingredient.tomatoes,
  'помідори чері': Ingredient.cherryTomatoes,

  'перець': Ingredient.pepper,
  'перець чилі': Ingredient.chiliPeppers,

  'печериці': Ingredient.mushrooms,
  'печериці свіжі': Ingredient.freshMushrooms,

  'морепродукти': Ingredient.seafood,
};
/* eslint-enable */
