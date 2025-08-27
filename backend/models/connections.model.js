const mongoose = require("mongoose");
const {ref}  = require("pdfkit");

const connectionRequest = new mongoose.Schema ({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
     connectionId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
     status_accepted : {
        type: Boolean,
        default: null
    },
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequest);
module.exports = ConnectionRequest;