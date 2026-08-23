const { success } = require("zod");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const emailservice = require("../service/sendEmail");
async function sendConnection(req, res) {
  try {
    const fromUserId = req?.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const [sender, receiver] = await Promise.all([
      UserModel.findById(fromUserId).select("firstName"),
      UserModel.findById(toUserId).select("firstName emailId"),
    ]);
    console.log(sender);

    if (!["ignored", "interested"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }
    if (!receiver) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }
    if (fromUserId.toString() === toUserId.toString()) {
      return res
        .status(400)
        .json({ success: false, error: "Cannot send request to yourself" });
    }
    const existing = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existing) {
      if (existing.status === "accepted") {
        return res
          .status(400)
          .json({ sucess: false, error: "User already in your connection" });
      }
      if (existing.status === "interested") {
        return res
          .status(400)
          .json({
            sucess: false,
            error: "already showed interested to this profile",
          });
      }
      if (existing.status === "ignored") {
        return res
          .status(400)
          .json({ sucess: false, error: "already ignored this profile" });
      }
    }
    const connection = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const connectionResult = await connection.save();
        if(status==="interested"){
    emailservice.sendEmail({
      to: receiver.emailId,
      subject: "New connection request on DevTinder",
      text: `${sender.firstName} showed interested in your profile.`,
      html: `
    <h2>New Connection Request</h2>
    <p><strong>${sender.firstName}</strong> showed interest in your profile.</p>
    <p>Open DevTinder to respond.</p>
  `,
    });
  }
    res.json({
      success: true,
      message: `${sender.firstName} is ${status} in ${receiver.firstName} profile`,
      connectionResult,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
async function reviewConnectionRequest(req, res) {
  try {
    const loggedInUser = req.user?._id;
    const { status, requestId } = req.params;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "invalid status",
      });
    }
    const connection = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: loggedInUser,
      status: "interested",
    });
    if (!connection) {
      return res
        .status(400)
        .json({ success: false, message: "connection request not found" });
    }
    connection.status = status;
    await connection.save();
    res.json({
      success: true,
      message: `Request ${status} successfully`,
      connection,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
}
module.exports = { sendConnection, reviewConnectionRequest };
