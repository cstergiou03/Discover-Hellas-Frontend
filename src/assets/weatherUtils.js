export const getWeatherIcon = (code) => {
  if (code === 0) return '☀️';
  if (code >= 1 && code <= 3) return '⛅';
  if (code >= 45 && code <= 57) return '🌫️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code === 80) return '🌦️';
  return '☁️';
};

export const getWeatherDescription = (code) => {
  if (code === 0) return 'Αίθριος ουρανός';
  if (code >= 1 && code <= 3) return 'Μερικώς νεφελώδης';
  if (code >= 45 && code <= 57) return 'Ομιχλώδης';
  if (code >= 61 && code <= 67) return 'Βροχερός';
  if (code >= 71 && code <= 77) return 'Χιονισμένος';
  if (code === 80) return 'Ελαφριά βροχή';
  return 'Συννεφιασμένος';
};

