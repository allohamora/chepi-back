# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0](https://github.com/Allohamora/chepi-back/compare/v2.2.0...v3.0.0) (2022-02-28)

### ⚠ BREAKING CHANGES

- rename state to stats
- rename orderBy keys to correct
- **pizza-parser:** fix wrong changes calculation and rename createdAt to updatedAt
- **pizza-parser:** rename timestamp to createdAt

### Features

- add api description for changes ([81be035](https://github.com/Allohamora/chepi-back/commits/81be035ed8805794439a22acbb039cedce45107e))
- **pizza-parser:** add changes field ([2e70d41](https://github.com/Allohamora/chepi-back/commits/2e70d41711e8bbe9c597c19ee4679f7ba581f8a5))
- **pizzas:** update pizzas.json ([41635ed](https://github.com/Allohamora/chepi-back/commits/41635edaaa9a33091a729b6770b90c08b84d525a))
- restore image and link mappings ([55eb50a](https://github.com/Allohamora/chepi-back/commits/55eb50a9736014dedab5e12ed349917a94f8f442))

### Bug Fixes

- **pizza-parser:** fix invalid changes compose ([a418023](https://github.com/Allohamora/chepi-back/commits/a41802361e10d9ad2e07c5e36a1dde8ebb38111c))
- **pizza-parser:** fix wrong changes calculation and rename createdAt to updatedAt ([8362cef](https://github.com/Allohamora/chepi-back/commits/8362cef5d469199fa0664d59cbbcf964bed1a93e))
- **pizza-parser:** invalid types bug ([2f1f3e0](https://github.com/Allohamora/chepi-back/commits/2f1f3e0fec737276e4b88242d97cbe2c369dd750))
- **pizza-parser:** rename pizza keys to correct ([863fcd4](https://github.com/Allohamora/chepi-back/commits/863fcd41e950503ae5a3e198893446e5bbd50987))
- rename orderBy keys to correct ([79ca403](https://github.com/Allohamora/chepi-back/commits/79ca4038f5ad21394eba78c20d130f1ed038e225))
- rename state to stats ([1fa9fc3](https://github.com/Allohamora/chepi-back/commits/1fa9fc33694b3ee0396d723624edbf4e9f82a044))

- **pizza-parser:** rename timestamp to createdAt ([499d9d4](https://github.com/Allohamora/chepi-back/commits/499d9d4e0fc9b9523bd7bc8eee11b644462f2afe))

## [2.2.0](https://github.com/Allohamora/chepi-back/compare/v2.1.1...v2.2.0) (2022-02-06)

### ⚠ BREAKING CHANGES

- remove /total endpoint

### Features

- add pizzas state endpoint ([2ef85ca](https://github.com/Allohamora/chepi-back/commits/2ef85ca17d759532b94f65749ed5fe41abefbc89))
- **pizza-parser:** improve misteram size parsing ([0873c40](https://github.com/Allohamora/chepi-back/commits/0873c4008f48856f03c1fb8d1098e9f58495766a))
- **pizza-parser:** remove monopizza ([57e6a51](https://github.com/Allohamora/chepi-back/commits/57e6a51d692a8ec9a3c6efb61a0b7233f6a1180a))
- **pizzas:** add new build ([2e6e8b6](https://github.com/Allohamora/chepi-back/commits/2e6e8b6b18e8f87667e9fead5d4a190c09bdc002))
- remove /total endpoint ([086f68c](https://github.com/Allohamora/chepi-back/commits/086f68c990a2416b9ea0878b3caa3c322d5003c3))

### Bug Fixes

- **libs:** fix build crash ([37aa891](https://github.com/Allohamora/chepi-back/commits/37aa89148771771286162e0ca7173937f50ec203))
- **pizza-parsed:** misteram incorrect blacklist work ([a08851d](https://github.com/Allohamora/chepi-back/commits/a08851df5df6d8bfe0a1f41dff4e499510fa52bb))
- **pizza-parser:** fix missed monopizza bug ([30bd9ea](https://github.com/Allohamora/chepi-back/commits/30bd9ead8608b82a4d68ede6cb0e1f80590309cf))
- **pizza-parser:** fix parser refactor bugs ([c1c6553](https://github.com/Allohamora/chepi-back/commits/c1c6553e8b36faa6d2c5a72b90ef3b3a16609a7e))
- **pizza-parser:** incorrect empty description ([0e001c1](https://github.com/Allohamora/chepi-back/commits/0e001c139a86cf238ea940f4dc0d00f243127e42))

### [2.1.1](https://github.com/Allohamora/chepi-back/compare/v2.1.0...v2.1.1) (2021-09-28)

### ⚠ BREAKING CHANGES

- **pizza-parser:** change dynamic nanoid id to sha256 hash
- **pizza-parser:** Remove undici, socks-proxy-agent. Replace undici to got.

### Features

- **pizza-parser:** update uk/che lapiec parser ([5fc8254](https://github.com/Allohamora/chepi-back/commits/5fc8254c654dc3bd93e93a5005b58a70d74ad0c6))

- **pizza-parser:** add dynamic rotating proxies for translate ([0e90f82](https://github.com/Allohamora/chepi-back/commits/0e90f82109a0b5638d8166bcdb3e88c9af3d77d9))
- **pizza-parser:** change dynamic nanoid id to sha256 hash ([a28f7fa](https://github.com/Allohamora/chepi-back/commits/a28f7fafe1ab285080d8695838aadeba83628706))

## [2.1.0](https://github.com/Allohamora/chepi-back/compare/v2.0.1...v2.1.0) (2021-09-15)

### Bug Fixes

- **pizza-parser:** spaces between «» and invalid values in pizzas.json ([3ecd5b0](https://github.com/Allohamora/chepi-back/commits/3ecd5b0a9183aab4eff103cc69f16b72524860da))

### [2.0.1](https://github.com/Allohamora/chepi-back/compare/v2.0.0...v2.0.1) (2021-09-15)

### Bug Fixes

- **pizza-parser:** invalid symbols in title and description ([583b2a2](https://github.com/Allohamora/chepi-back/commits/583b2a2b803063e8874045f398dd8690fd5add95))

## [2.0.0](https://github.com/Allohamora/chepi-back/compare/v1.0.0...v2.0.0) (2021-09-15)

### ⚠ BREAKING CHANGES

- remove variants field
- change google translate to libretranslate
- remove ingredient
- now pizzas parser is abstract class

### Features

- add orderBy for getPizzas ([45b4cbf](https://github.com/Allohamora/chepi-back/commits/45b4cbf715da39994dfd0eaaac2e90f401137714))
- add uk/che misteram ([052705e](https://github.com/Allohamora/chepi-back/commits/052705e1a0d9c178090d4bd0ba2f0dd5054ba3ff))
- add uk/che monopizza parser ([c4dfa99](https://github.com/Allohamora/chepi-back/commits/c4dfa990f90ae782e5c85f1c8562c4b568199d82))
- enable cors ([9cb1e1c](https://github.com/Allohamora/chepi-back/commits/9cb1e1c6da67d8c42294def2ec59330fc6d080ed))
- migrate to elasticsearch ([21fb943](https://github.com/Allohamora/chepi-back/commits/21fb943cb7b131a4271f5adab471c045618f3226))
- **pizza-parser:** add free-google-translate with tor proxy ([04a8d5c](https://github.com/Allohamora/chepi-back/commits/04a8d5c17cb780bd8f8c9918e52bc62480705de7))
- **pizza-parser:** add uk/che czernowizza parser ([800766e](https://github.com/Allohamora/chepi-back/commits/800766eb0d19d008b1a492d121cd5b57d23c4a86))
- **pizza-parser:** add uk/che dongustavo parser ([dc3f2f1](https://github.com/Allohamora/chepi-back/commits/dc3f2f1505b042cc6d879c306371143fee690c2c))
- **pizza-parser:** add uk/che lapiec parser ([88d4b0e](https://github.com/Allohamora/chepi-back/commits/88d4b0e6d2cae36bcc0cb6797ae088f71651a7d9))
- **pizza-parser:** add uk/che misteram panska-vtiha parser ([c76c4d7](https://github.com/Allohamora/chepi-back/commits/c76c4d7c05bfa85f0d57057bbe5021f924788498))
- **pizza-parser:** add uk/che misteram pizzapark parser ([e876f25](https://github.com/Allohamora/chepi-back/commits/e876f2531e58b2006ebe070a62ecd9f2cdf714cd))
- **pizza-parser:** add uk/che pizza-it parser ([985d4d8](https://github.com/Allohamora/chepi-back/commits/985d4d899fe5d3736a356a1769828276851abd38))

### Bug Fixes

- change 0 to null in pizzas ([3e12625](https://github.com/Allohamora/chepi-back/commits/3e12625068c9d1d40491f17854816dc08a33be67))
- getByIds incorrect result when ids.length === 0 ([62bddd7](https://github.com/Allohamora/chepi-back/commits/62bddd7a3013bc20e561f421deb8f85f5413f905))
- ingredient typos ([4b47e54](https://github.com/Allohamora/chepi-back/commits/4b47e54a757ca6e10b6185dbb159506f56249a68))
- **pizza-parser:** capslocked and ", .." title and description ([5d4d50a](https://github.com/Allohamora/chepi-back/commits/5d4d50abba84eda3d0b6bc12be35e6d3e323008e))
- **pizza-parser:** ingredient typos ([f251daa](https://github.com/Allohamora/chepi-back/commits/f251daac8746ee93274a53dd1174e487e5d52382))
- **pizza-parser:** pizza type typo ([bca14f0](https://github.com/Allohamora/chepi-back/commits/bca14f022fdd2afb92a7ab95603c57ba7d92f20b))

- add abstact class chernivtsi pizza parser ([5a1f4e5](https://github.com/Allohamora/chepi-back/commits/5a1f4e5fb55d6b2b29ab9d6f8c0bcda90b881831))
- add libretranslate translate ([3ae1377](https://github.com/Allohamora/chepi-back/commits/3ae13774e5de204a44f0157d8bdddddc0dbf53af))
- change pizza structure ([f33b635](https://github.com/Allohamora/chepi-back/commits/f33b635d205aae887cd1fd8dc154f2d6e303951f))
- remove ingredient ([79a2bb4](https://github.com/Allohamora/chepi-back/commits/79a2bb4d11cf35e13abc3e91c9c467588bf8dfe2))

## 1.0.0 (2021-09-02)

### Features

- add api routes for pizza ([8958684](https://github.com/Allohamora/chepi-back/commits/895868484f6171c4adea9ed0ecb93bb90e4f6729))
- add build(translating and .json output) for pizzas ([8386d53](https://github.com/Allohamora/chepi-back/commits/8386d532d22e1e8931cbabb3ed26280e4cb675c9))
- add search for pizza ([b5e7069](https://github.com/Allohamora/chepi-back/commits/b5e7069a6ad3534139e75e466ce6ed83bb8d007d))
- add swagger and more types ([8e646c7](https://github.com/Allohamora/chepi-back/commits/8e646c7d2bf52bb7dceb6abd921e4283dd64db04))
- add uk/che appeti parser ([c888ce9](https://github.com/Allohamora/chepi-back/commits/c888ce980f0416dcb485de77f2b7a50a799c37af))
- add uk/che chelentano parser ([d2e3cf0](https://github.com/Allohamora/chepi-back/commits/d2e3cf07ab2b39fc792d7b593bce15710625be9c))
- add uk/che shosho parser ([8b9f0e3](https://github.com/Allohamora/chepi-back/commits/8b9f0e339331292861dd59acd0a3f003c2ff804e))
- **fts:** add where builder ([8f078fd](https://github.com/Allohamora/chepi-back/commits/8f078fd33f10b72aaedd1c618af83abafe9bd470))
- **fts:** add where to select and add update and delete methods ([7be708e](https://github.com/Allohamora/chepi-back/commits/7be708e2e89d5acf73741fe2dffac2bcb8fa1944))

### Bug Fixes

- **fts:** invalid select options and add space in where.builder ([11fde59](https://github.com/Allohamora/chepi-back/commits/11fde59406775ceb93edc82f21abb0ac6e832c1e))
- invalid Dockerfile and invalid start:prod command ([3dde667](https://github.com/Allohamora/chepi-back/commits/3dde667b748d2a5141adb0f9f38e31946e66a9e5))
- pizza structure and rename green ingredient to herb ([b88ba80](https://github.com/Allohamora/chepi-back/commits/b88ba8048acf679ff822a3b708dd34b59a7c593f))
