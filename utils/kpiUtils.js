// kpiUtils.js

const calculateProgress = (totalNumber, target) => {
  if (totalNumber === 0 || isNaN(totalNumber) || isNaN(target)) {
    return 0; // or any other default value that makes sense for your use case
  }
  const progress = (totalNumber / target) * 100;
  return progress.toFixed(2); // Round to 2 decimal places
};

const calculateDelta = (currentTotal, previousTotal) => {
  if (isNaN(previousTotal) || previousTotal === 0) return 0;
  const deltaPercentage =
    ((currentTotal - previousTotal) / previousTotal) * 100;
  return parseFloat(deltaPercentage.toFixed(2));
};

const getDeltaType = (deltaPercentage) => {
  // Determine the delta type based on the percentage
  if (deltaPercentage > 50) {
    return "increase";
  } else if (deltaPercentage > 0) {
    return "moderateIncrease";
  } else if (deltaPercentage == 0) {
    return "unchanged";
  } else if (deltaPercentage < 0 && deltaPercentage > -50) {
    return "moderateDecrease";
  } else {
    return "decrease";
  }
};

module.exports = {
  calculateProgress,
  calculateDelta,
  getDeltaType,
};
