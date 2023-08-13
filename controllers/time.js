const cron = require("node-cron");
const { updateKpi } = require("./kpi");

let updateKpiCronJob;
let cronExpression = "00 01 * * *"; // Default cron expression

// Get the current update time
const getUpdateTime = (req, res) => {
  if (updateKpiCronJob) {
    res.status(200).json({ cronExpression });
  } else {
    res.status(200).json({ cronExpression: null });
  }
};

// Update the update time
const updateUpdateTime = (req, res) => {
  const { newScheduledTime } = req.body;

  if (updateKpiCronJob) {
    updateKpiCronJob.stop();
  }

  cronExpression = newScheduledTime; // Update the cron expression

  updateKpiCronJob = cron.schedule(
    cronExpression,
    async () => {
      try {
        await updateKpi();
      } catch (error) {
        console.log("Error in scheduled task:", error);
      }
    },
    { timezone: "Asia/Ho_Chi_Minh", scheduled: true }
  );

  updateKpiCronJob.start();

  res.status(200).json({ message: "Scheduled update time has been updated" });
};

module.exports = {
  getUpdateTime,
  updateUpdateTime,
};
