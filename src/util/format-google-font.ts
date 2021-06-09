import { FontWeight } from '../constants/md-style-options';

export const formatGoogleFont = (
  fontFamily: string,
  weightsArray: FontWeight[] = [],
  italicWeightsArray: FontWeight[] = []
): string => {
  const italicWeights = italicWeightsArray.map((weight) => `${weight}italic`);
  const weights = [...weightsArray, ...italicWeights].join(',');
  return `${fontFamily}${weights ? ':' : ''}${weights}`;
};
