const calculateCombinedMatchRatio = (
  matchingFavorites: number,
  matchingGenres: number,
  totalFavorites: number,
  totalGenres: number,
): number => {
  const favoritesMatchRatio = Math.floor(
    (matchingFavorites / totalFavorites) * 100,
  );
  const genresMatchRatio = Math.floor((matchingGenres / totalGenres) * 100);

  // Calculate the combined match ratio
  const combinedMatchRatio = Math.floor(
    (favoritesMatchRatio + genresMatchRatio) / 2,
  );

  return combinedMatchRatio;
};
export default { calculateCombinedMatchRatio };
