import i18next from 'i18next';
import _ from 'lodash';

import { IGenre } from '@schemas/genre';

interface IResponseStatus {
  message: string | null;
  statusCode: number | null;
  results: object | Array<object | []>;
}

const makeResponseJson = (
  message: string | null,
  results: object | Array<object | []>,
  statusCode: number | null,
): IResponseStatus => {
  return {
    message: i18next.t(message),
    statusCode,
    results,
  };
};

// * Calculating movie and TV series length in Hours and Minutes
const runTime = (runtime: number, language: string): string => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (language.includes('tr')) {
    if (hours === 1) {
      return `${hours} saat`;
    } else if (hours > 0) {
      return `${hours} saat ${minutes} dakika`;
    } else {
      return `${minutes} dakika`;
    }
  } else if (language.includes('en')) {
    if (hours === 1) {
      return `${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
};

type TotalSameElementProps = {
  name: string;
  percentage: number;
};

const totalSameElement = (
  genresIds: (string | number)[],
  schema: IGenre[],
): TotalSameElementProps[] => {
  const counts = _.countBy(genresIds);
  const pairs = _.toPairs(counts).map((pair) => [parseInt(pair[0]), pair[1]]);
  const sortedPairs = _.orderBy(pairs, [1], ['desc']);

  const limit = 5; // Limit the results to top 5 genre IDs
  const topFivePairs = _.slice(sortedPairs, 0, limit);
  const totalTopFive = _.sumBy(topFivePairs, (pair) => pair[1]);
  const map = new Map<string, number>();

  for (const pair of topFivePairs) {
    const percentage = (pair[1] / totalTopFive) * 100;
    const genreName = schema.find((genre) => genre.id === pair[0])?.name;
    map.set(String(genreName), Math.floor(percentage));
  }

  const array = Array.from(map, ([name, percentage]) => ({ name, percentage }));

  return array;
};

export default { makeResponseJson, runTime, totalSameElement };
