interface AspectRatio {
  width: number;
  height: number;
}

export const calculateAspectRatio = (
  ratio: number,
  userAdjustedValue: Partial<AspectRatio>
): AspectRatio => {
  if (userAdjustedValue.width) {
    return {
      width: userAdjustedValue.width,
      height: Math.ceil(userAdjustedValue.width / ratio)
    };
  }
  if (userAdjustedValue.height)
    return {
      width: Math.ceil(userAdjustedValue.height * ratio),
      height: userAdjustedValue.height
    };
  return { width: 1920, height: 1080 };
};
