export const fi = {
  'app.title': 'Laskurit',
  'meta.title': 'Laskurit',
  'meta.description': 'Kätsyt laskurit, myös kännykkään!',

  'nav.all': 'Kaikki',
  'nav.time': 'Aikaleimat',
  'nav.numbers': 'Numerot ja merkit',
  'nav.identifiers': 'Tunnisteet',
  'nav.colors': 'Värit',
  'nav.bytesizes': 'Tavukoot',
  'nav.links': 'Linkit',
  'nav.textConversions': 'Tekstimuunnokset',
  'nav.cryptography': 'Kryptografia',
  'nav.pixeldensity': 'Pikselitiheys',

  'theme.system': 'Järjestelmän teema',
  'theme.light': 'Vaalea teema',
  'theme.dark': 'Tumma teema',

  'lang.toggleTooltip': 'Vaihda englanniksi',
} as const;

export type TranslationKey = keyof typeof fi;
