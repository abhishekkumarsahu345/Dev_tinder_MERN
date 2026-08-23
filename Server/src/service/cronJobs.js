const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const emailservice = require("../service/sendEmail");
cron.schedule("0 2 * * *", async () => {
  console.log("⏰ Cron running at", new Date().toISOString());
  try {
    const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;
    const now = new Date();
    const fifiteendaysAgo = new Date(now.getTime() - FIFTEEN_DAYS);
    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      $or: [
        { lastReminderAt: null, createdAt: { $lte: fifiteendaysAgo } },
        { lastReminderAt: { $lte: fifiteendaysAgo } },
      ],
    })
      .populate("toUserId", "emailId firstName")
      .populate("fromUserId", "firstName");
    console.log(pendingRequests);

    for (const req of pendingRequests) {
      await emailservice.sendEmail({
        to: req.toUserId.emailId,
        subject: "New connection request on DevTinder",
        text: `${req.fromUserId.firstName} showed interested in your profile.`,
        html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>👋 New Connection Request</h2>

    <p>
      <strong>${req.fromUserId.firstName}</strong> showed interest in your profile on 
      <strong>DevTinder</strong>.
    </p>

    <p>
      Open the app to accept or ignore this request.
    </p>

    <br />

    <p style="color: #555;">
      — Team DevTinder
    </p>
  </div>
`,
      });

      req.lastReminderAt = new Date();
      await req.save();
    }
  } catch (error) {
    console.error(error.message);
  }
});
