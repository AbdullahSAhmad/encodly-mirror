// EFF Large Wordlist for Diceware (sample - in production use full 7776 words)
export const EFF_LARGE_WORDLIST = [
  'abacus', 'abdomen', 'abdominal', 'abide', 'abiding', 'ability', 'ablaze', 'able', 'abnormal', 'abode',
  'abolish', 'abrasive', 'abruptly', 'absence', 'absent', 'absolute', 'absolve', 'absorb', 'abstract', 'absurd',
  'accent', 'accept', 'access', 'accident', 'acclaim', 'accord', 'account', 'accuracy', 'accurate', 'achieve',
  'acid', 'acidic', 'acoustic', 'acquire', 'acre', 'acrobat', 'acting', 'action', 'activate', 'active',
  'activism', 'activist', 'activity', 'actor', 'actress', 'actual', 'acute', 'adamant', 'adapt', 'add',
  'adder', 'addict', 'addition', 'adequate', 'adhere', 'adjacent', 'adjective', 'adjust', 'admin', 'admit',
  'adolescent', 'adopt', 'adult', 'advance', 'advent', 'adventure', 'adverse', 'advertise', 'advice', 'advise',
  'advocate', 'aerial', 'aerobic', 'aerospace', 'affair', 'affect', 'affirm', 'afford', 'afloat', 'afraid',
  'after', 'again', 'against', 'aged', 'agency', 'agenda', 'agent', 'ages', 'aggravate', 'aggregate',
  'aging', 'agitate', 'agony', 'agree', 'ahead', 'aide', 'aim', 'air', 'aircraft', 'airfield',
  // ... This would continue for all 7776 words
  'zone', 'zoo', 'zoom', 'zucchini'
];

// Pronounceable syllables for generating memorable passwords
export const SYLLABLES = {
  consonants: ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'x', 'z'],
  vowels: ['a', 'e', 'i', 'o', 'u'],
  consonantClusters: ['bl', 'br', 'ch', 'ck', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'ph', 'pl', 'pr', 'sc', 'sh', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'sw', 'th', 'tr', 'tw', 'wh'],
  vowelCombinations: ['ai', 'au', 'ay', 'ea', 'ee', 'ei', 'eu', 'ey', 'ie', 'oa', 'oi', 'oo', 'ou', 'ow', 'oy', 'ue', 'ui']
};

// Memorable patterns for pattern-based passwords
export const MEMORABLE_PATTERNS = [
  {
    name: 'Word + Number + Symbol',
    pattern: 'Wn#',
    description: 'A word followed by numbers and a symbol',
    example: 'Butterfly47!'
  },
  {
    name: 'Two Words + Year',
    pattern: 'WwY',
    description: 'Two words separated by a year',
    example: 'Blue2024Cat'
  },
  {
    name: 'Acronym + Date + Symbol',
    pattern: 'Adn#',
    description: 'Acronym with date and special character',
    example: 'NASA1969@'
  },
  {
    name: 'Mixed Case Word Pairs',
    pattern: 'WwWw',
    description: 'Alternating case word pairs',
    example: 'sunMOONstarSKY'
  }
];