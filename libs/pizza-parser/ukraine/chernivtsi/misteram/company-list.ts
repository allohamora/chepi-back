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
}

export const COMPANY_LIST: Company[] = [
  { slug: 'pizzapark', id: 420, categories: [{ id: 4798, size: null, slug: 'pizza' }] },
  {
    slug: 'panska-vtiha',
    id: 513,
    categories: [{ id: 6130, size: null, slug: 'pizza', blacklist: [/лаваш/, /хачапурі/] }],
  },
  {
    slug: 'lapasta',
    id: 3134,
    categories: [{ id: 38384, size: null, slug: 'pizza', remove: [/,?\s+зауважте.+$/u], blacklist: [/фокачча/] }],
  },
  {
    slug: 'baza',
    id: 563,
    categories: [
      { id: 7067, size: 50, slug: 'pizza' },
      { id: 7068, size: 30, slug: 'pizza30' },
    ],
  },
  {
    slug: 'picantico',
    id: 1103,
    categories: [
      { id: 13559, size: 50, slug: 'pizza50' },
      { id: 13558, size: 35, slug: 'pizza35' },
    ],
  },
  {
    slug: 'thesad',
    id: 2096,
    categories: [
      { id: 26669, size: null, slug: 'pizza' },
      { id: 32975, size: 50, slug: 'pizza50' },
    ],
  },
  { slug: 'monopoli', id: 803, categories: [{ id: 13020, size: null, slug: 'pizza' }] },
  { slug: 'kartoteka', id: 1323, categories: [{ id: 16173, size: null, slug: 'pizza' }] },
  { slug: 'chicheri', id: 448, categories: [{ id: 35368, size: 30, slug: 'pizza30' }] },
  {
    slug: 'gorno',
    id: 1338,
    categories: [
      { id: 16461, size: 30, slug: 'pizza30' },
      { id: 16704, size: 50, slug: 'pizza50' },
    ],
  },
  { slug: 'bruno', id: 669, categories: [{ id: 8166, size: null, slug: 'pizza' }] },
  {
    slug: 'mamaspizza',
    id: 1026,
    categories: [
      { id: 13687, size: 30, slug: 'pizza30' },
      { id: 13686, size: 50, slug: 'pizza50' },
    ],
  },
  { slug: 'riposo', id: 635, categories: [{ id: 7666, size: 30, slug: 'pizza' }] },
  {
    slug: 'chebonta',
    id: 2754,
    categories: [
      { id: 34248, size: 50, slug: 'pizza50' },
      { id: 34245, size: 35, slug: 'pizza35' },
    ],
  },
  { slug: 'terassa', id: 1124, categories: [{ id: 42425, size: 30, slug: 'pizza30' }] },
  { slug: 'kucheri', id: 1111, categories: [{ id: 14047, size: 30, slug: 'pizza' }] },
  { slug: 'kleopatra', id: 713, categories: [{ id: 14366, size: null, slug: 'pizza' }] },
  { slug: 'ciabatta', id: 1069, categories: [{ id: 13168, size: 30, slug: 'pizza' }] },
  {
    slug: 'diverso',
    id: 3076,
    categories: [{ id: 37363, size: null, slug: 'pizzaburgers', blacklist: [/бургер/] }],
  },
  {
    slug: 'yourpizza',
    id: 3034,
    categories: [
      { id: 36919, size: 20, slug: 'pizza20' },
      { id: 36916, size: 30, slug: 'pizza30' },
      { id: 36913, size: 50, slug: 'pizza50' },
    ],
  },
  {
    slug: 'familybakerypizza',
    id: 3022,
    categories: [
      { id: 36766, size: 30, slug: 'pizza30', remove: [/ ?Ø30/] },
      { id: 36850, size: 40, slug: 'pizza40', remove: [/ ?Ø40/] },
    ],
  },
  { slug: 'aveceasare', id: 2633, categories: [{ id: 32894, size: 30, slug: 'pizza30' }] },
  { slug: 'pastamia', id: 2255, categories: [{ id: 28784, size: null, slug: 'pizza', blacklist: [/пінца/] }] },
];
