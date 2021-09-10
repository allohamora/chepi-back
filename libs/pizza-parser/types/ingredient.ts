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
  barbecueSauce = 'barbecueSauce',
  whiteSauce = 'whiteSauce',
  truffleOil = 'truffleOil',
  spinachCreamSauce = 'spinachCreamSauce',

  bacon = 'bacon',
  ham = 'ham',
  chicken = 'chicken',
  bakedChickenFillet = 'bakedChickenFillet',
  smokedChicken = 'smokedChicken',
  smokedChickenFillet = 'smokedChickenFillet',
  chickenFillet = 'chickenFillet',
  prosciutto = 'prosciutto',
  mincedSalsiccia = 'mincedSalsiccia',
  huntingSausages = 'huntingSausages',
  eggs = 'eggs',
  quailEggs = 'quailEggs',
  cannedTuna = 'cannedTuna',
  saltedSalmonFillet = 'saltedSalmonFillet',

  salami = 'salami',
  spicySalami = 'spicySalami',
  piquantSalami = 'piquantSalami',
  pepperoni = 'pepperoni',

  cheese = 'cheese',
  creamCheese = 'creamCheese',
  mozzarellaFresca = 'mozzarellaFresca',
  mozzarella = 'mozzarella',
  parmesan = 'parmesan',
  feta = 'feta',
  gorgonzola = 'gorgonzola',
  radomer = 'radomer',
  cheddar = 'cheddar',
  dorBlue = 'dorBlue',
  hardCheese = 'hardCheese',

  salad = 'salad',
  saladMix = 'saladMix',
  arugulaSalad = 'arugulaSalad',
  icebergLettuce = 'icebergLettuce',
  lolloRosso = 'lolloRosso',

  herb = 'herb',
  arugula = 'arugula',
  italianHerbs = 'italianHerbs',
  cashew = 'cashew',
  onion = 'onion',
  redOnion = 'redOnion',
  pickledRedOnions = 'pickledRedOnions',
  parsley = 'parsley',
  corn = 'corn',
  grilledEggplant = 'grilledEggplant',
  pickledZucchini = 'pickledZucchini',
  artichokes = 'artichokes',
  pear = 'pear',
  pineapple = 'pineapple',
  blackOlives = 'blackOlives',
  greenOlives = 'greenOlives',
  capers = 'capers',
  basil = 'basil',
  pickledCucumbers = 'pickledCucumbers',
  spinach = 'spinach',

  tomatoes = 'tomatoes',
  cherryTomatoConfit = 'cherryTomatoConfit',
  cherryTomatoes = 'cherryTomatoes',
  sunDriedTomatoes = 'sunDriedTomatoes',

  pepper = 'pepper',
  pepperoniPepper = 'pepperoniPepper',
  chiliPepper = 'chiliPepper',
  bellPepper = 'bellPepper',
  bakedPepper = 'bakedPepper',
  hotPepper = 'hotPepper',
  sweetPepper = 'sweetPepper',

  mushrooms = 'mushrooms',
  freshMushrooms = 'freshMushrooms',
  champignons = 'champignons',
  whiteMushrooms = 'whiteMushrooms',
  chanterelles = 'chanterelles',

  seafood = 'seafood',
  shrimps = 'shrimps',
  squid = 'squid',
  mussels = 'mussels',

  honey = 'honey',
}

/* eslint-disable */
// prettier-ignore
export const UkToIngredient: Record<string, Ingredient> = {
  'основа': Ingredient.pizzaBase,
  'тісто': Ingredient.dough,

  'соус': Ingredient.sauce,
  'coyc': Ingredient.sauce,
  'соус песто': Ingredient.pestoSauce,
  'соус(томатний/вершковий)': Ingredient.tomatoOrCreamSauce,
  'томатний соус': Ingredient.tomatoSauce,
  'соус томатний': Ingredient.tomatoSauce,
  'домашній томатний соус': Ingredient.homemadeTomatoSauce,
  'соус цезар': Ingredient.caesarSauce,
  'соус цезаре': Ingredient.caesarSauce,
  'зелений соус': Ingredient.greenSauce,
  'соус вершковий': Ingredient.creamSauce,
  'вершковий соус': Ingredient.creamSauce,
  'соус bbq': Ingredient.barbecueSauce,
  'білий coyc': Ingredient.whiteSauce,
  'білий соус': Ingredient.whiteSauce,
  'трюфельна олія': Ingredient.truffleOil,
  'соус шпинатно-вершковий': Ingredient.spinachCreamSauce,

  'бекон': Ingredient.bacon,
  'шинка': Ingredient.ham,
  'курка': Ingredient.chicken,
  'куряче філе': Ingredient.chickenFillet,
  'куряче філе печене': Ingredient.bakedChickenFillet,
  'копчена курка': Ingredient.smokedChicken,
  'м’ясний фарш сальсіча': Ingredient.mincedSalsiccia,
  'прошуто': Ingredient.prosciutto,
  'прошутто': Ingredient.prosciutto,
  'ковбаски мисливські': Ingredient.huntingSausages,
  'мисливські ковбаски': Ingredient.huntingSausages,
  'яйце перепелине': Ingredient.quailEggs,
  'перепелині яйця': Ingredient.quailEggs,
  'тунець консервований': Ingredient.cannedTuna,
  'філе курки копчене': Ingredient.smokedChickenFillet,
  'яйце': Ingredient.eggs,
  'філе лосося солене': Ingredient.saltedSalmonFillet,

  'салямі': Ingredient.salami,
  'салямі пікантне': Ingredient.piquantSalami,
  'салямі піканте': Ingredient.piquantSalami,
  'гостре салямі': Ingredient.spicySalami,
  'пепероні': Ingredient.pepperoni,

  'сир': Ingredient.cheese,
  'крем-сир': Ingredient.creamCheese,
  'сир мацарелла': Ingredient.mozzarella,
  'сир моцарелла': Ingredient.mozzarella,
  'сир моцарела': Ingredient.mozzarella,
  'моцарелла': Ingredient.mozzarella,
  'моцарела': Ingredient.mozzarella,
  'моцарела фреска': Ingredient.mozzarellaFresca,
  'сир пармезан': Ingredient.parmesan,
  'сири пармезан': Ingredient.parmesan,
  'пармезан': Ingredient.parmesan,
  'сир фета': Ingredient.feta,
  'фета': Ingredient.feta,
  'сири горгонзола': Ingredient.gorgonzola,
  'горгонзола': Ingredient.gorgonzola,
  'радомер': Ingredient.radomer,
  'чеддер слайс': Ingredient.cheddar,
  'сир дор блю': Ingredient.dorBlue,
  'дор блю': Ingredient.dorBlue,
  'сир твердий': Ingredient.hardCheese,

  'салат': Ingredient.salad,
  'мікс-салат': Ingredient.saladMix,
  'салат мікс': Ingredient.saladMix,
  'салат рукола': Ingredient.arugulaSalad,
  'салат айсберг': Ingredient.icebergLettuce,
  'лолло росса': Ingredient.lolloRosso,

  'зелень': Ingredient.herb,
  'рукола': Ingredient.arugula,
  'італійські трави': Ingredient.italianHerbs,
  'горіхи кешью': Ingredient.cashew,
  'цибуля ріпчаста': Ingredient.onion,
  'червона цибуля': Ingredient.redOnion,
  'цибуля червона': Ingredient.redOnion,
  'цибуля червона маринована': Ingredient.pickledRedOnions,
  'петрушка': Ingredient.parsley,
  'кукурудза': Ingredient.corn,
  'баклажани гриль': Ingredient.grilledEggplant,
  'мариновані цукіні': Ingredient.pickledZucchini,
  'артишоки': Ingredient.artichokes,
  'груша': Ingredient.pear,
  'ананаси': Ingredient.pineapple,
  'ананас': Ingredient.pineapple,
  'оливки': Ingredient.greenOlives,
  'маслини': Ingredient.blackOlives,
  'каперси': Ingredient.capers,
  'базилік': Ingredient.basil,
  'огірки мариновані': Ingredient.pickledCucumbers,
  'шпинат': Ingredient.spinach,

  'помідора': Ingredient.tomatoes,
  'помідор': Ingredient.tomatoes,
  'помідори': Ingredient.tomatoes,
  'конфі з помідорів чері': Ingredient.cherryTomatoConfit,
  'помідори чері': Ingredient.cherryTomatoes,
  'томати в\'ялені': Ingredient.sunDriedTomatoes,
  'в\'ялені томати': Ingredient.sunDriedTomatoes,
  'помідори в’ялені': Ingredient.sunDriedTomatoes,

  'перець': Ingredient.pepper,
  'перець пепероні': Ingredient.pepperoniPepper,
  'болгарський перець': Ingredient.bellPepper,
  'перець болгарський': Ingredient.bellPepper,
  'перці болгарський': Ingredient.bellPepper,
  'перець чилі': Ingredient.chiliPepper,
  'чілі': Ingredient.chiliPepper,
  'запечений перець': Ingredient.bakedPepper,
  'гострий перець': Ingredient.hotPepper,
  'перець солодкий': Ingredient.sweetPepper,

  'гриби': Ingredient.mushrooms,
  'шампіньйони': Ingredient.champignons,
  'печериці': Ingredient.mushrooms,
  'печериці свіжі': Ingredient.freshMushrooms,
  'білі гриби': Ingredient.whiteMushrooms,
  'лисички': Ingredient.chanterelles,

  'морепродукти': Ingredient.seafood,
  'креветка': Ingredient.shrimps,
  'креветки': Ingredient.shrimps,
  'мідії': Ingredient.mussels,
  'кальмар': Ingredient.squid,

  'мед': Ingredient.honey,
};
/* eslint-enable */
