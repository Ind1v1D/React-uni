export const PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  { value: 'default', label: 'Default order' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'year', label: 'Newest first' },
  { value: 'title', label: 'Title A–Z' },
];

// OMDb cannot list "all movies", so the gallery starts with these IMDb ids.
// Any title can still be found with the search box.
export const FEATURED_IDS = [
  'tt0111161', 'tt0068646', 'tt0468569', 'tt0071562', 'tt0108052', 'tt0110912',
  'tt0137523', 'tt0109830', 'tt1375666', 'tt0133093', 'tt0099685', 'tt0114369',
  'tt0102926', 'tt0120815', 'tt0816692', 'tt0120737', 'tt0076759', 'tt0080684',
  'tt0088763', 'tt0245429', 'tt0172495', 'tt0482571', 'tt0407887', 'tt0114814',
  'tt0078748', 'tt0910970', 'tt0114709', 'tt0993846', 'tt1853728', 'tt2582802',
  'tt0120338', 'tt0848228', 'tt6751668', 'tt7286456', 'tt1392190', 'tt3896198',
  'tt0361748', 'tt0253474', 'tt0110413', 'tt0118715',
];
