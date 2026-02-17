const cron = require('node-cron');
const AutoPostRegistry = require('../../models/autoPostRegistryModel');
const config = require('../../config/config');

const startProductAutoPostCron = async () => {
  cron.schedule(
    config.autoPost.cronExpr,
    async () => {
      const now = new Date();

      const items = await AutoPostRegistry.find({
        isActive: true,
        isDeleted: false,
        nextPostDate: { $lte: now }
      });

      for (const item of items) {
        // 🔥 PLACE ACTUAL AUTO-POST LOGIC HERE (Focus8 voucher call)

        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + 1);

        item.lastPostedOn = new Date();
        item.nextPostDate = nextDate;

        await item.save();
      }
    },
    {
      timezone: config.autoPost.timezone
    }
  );
};

module.exports = {
  startProductAutoPostCron
};