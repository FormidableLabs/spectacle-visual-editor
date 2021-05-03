export type dimension = 'width' | 'height';
export const calculateAspectRatio = (
  ratio: number,
  dimension: dimension,
  userAdjustedValue: number
): { width: number; height: number } => {
  if (dimension === 'width') {
    return {
      width: userAdjustedValue,
      height: Math.ceil(userAdjustedValue / ratio)
    };
  } else {
    return {
      width: Math.ceil(userAdjustedValue * ratio),
      height: userAdjustedValue
    };
  }
};
