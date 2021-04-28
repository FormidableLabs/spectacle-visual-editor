interface AspectRatio {
  width: number;
  height: number;
}

export const calculateAspectRatio = (
  originalAspectRatio: AspectRatio,
  userAdjustedValue: Partial<AspectRatio>
) => {
  const ratio = originalAspectRatio.width / originalAspectRatio.height;
  if (userAdjustedValue.width)
    return {
      width: userAdjustedValue.width,
      height: parseFloat((userAdjustedValue.width / ratio).toFixed(2))
    };
  if (userAdjustedValue.height)
    return {
      width: parseFloat((userAdjustedValue.height * ratio).toFixed(2)),
      height: userAdjustedValue.height
    };
  return originalAspectRatio;
};
