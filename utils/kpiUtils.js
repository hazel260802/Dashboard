// kpiUtils.js

const calculateProgress = (totalNumber, target) => {
  const progress = (totalNumber / target) * 100;
  return progress.toFixed(2); // Round to 2 decimal places
};

const calculateDelta = (currentTotal, previousTotal) => {
  if (previousTotal === 0) return NaN;
  const deltaPercentage =
    ((currentTotal - previousTotal) / previousTotal) * 100;
  return parseFloat(deltaPercentage.toFixed(2));
};

const getDeltaType = (totalBookings) => {
  // Determine the delta type based on the percentage
  if (totalBookings >= 100) {
    return "increase";
  } else if (totalBookings >= 50) {
    return "moderateIncrease";
  } else if (totalBookings >= 25) {
    return "stabilize";
  } else if (totalBookings >= 10) {
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
