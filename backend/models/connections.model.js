const mongoose = require("mongoose");
const { ref } = require("pdfkit");

const connectionRequest = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status_accepted: {
    type: Boolean,
    default: null,
  },
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequest
);
module.exports = ConnectionRequest;
