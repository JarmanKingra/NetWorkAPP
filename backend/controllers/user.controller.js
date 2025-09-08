const User = require("../models/users.model");
const Profile = require("../models/profile.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const PDFdocument = require("pdfkit");
const fs = require("fs");
const ConnectionRequest = require("../models/connections.model");

const convertUserDataToPDF = async (userData) => {
  const doc = new PDFdocument();
  const outputpath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputpath);

  doc.pipe(stream);
  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: "center",
    width: 100,
  });
  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio: ${userData.bio}`);
  doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

  doc.fontSize(14).text(`Past Work :`);
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(14).text(`Company Name: ${work.company}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Years:  ${work.years}`);
  });

  doc.end();
  return outputpath;
};

const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    return res.json({ message: "User created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await crypto.randomBytes(32).toString("hex");
    user.token = token;

    await user.save();

    return res.json({ message: "User logged in", token: token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    user.profilePicture = req.file.filename;
    await user.save();
    return res.json({ message: "Profile Picture Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const { username, email } = newUserData;
    const existinguser = await User.findOne({ $or: [{ username }, { email }] });

    if (existinguser) {
      if (existinguser || String(existinguser._id) !== String(user._id)) {
        return res.status(400).json({ message: "User Exists" });
      }
    }

    Object.assign(user, newUserData);
    await user.save();

    return res.json({ message: "Profile Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { token } = req.query;
    console.log(`token :  ${token}`);
    const user = await User.findOne({ token: token });
    if (!user) { 
      return res.status(400).json({ message: "user not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );
 
    console.log(user)

    return res.json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllUserProfiles = async(req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    )
    return res.json(profiles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;
    const userProfile = await User.findOne({ token: token });

    if (!userProfile) {
      return res.status(400).json({ message: "user not found" });
    }

    const profileToUpdate = await Profile.findOne({ userId: userProfile._id });

    Object.assign(profileToUpdate, newProfileData);

    await profileToUpdate.save();

    return res.json(profileToUpdate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const downloadProfile = async (req, res) => {
  const user_id = req.query.id;
  const userProfile = await Profile.findOne({ userId: user_id }).populate(
    "userId",
    "name username email profilePicture"
  );

  let outputpath = await convertUserDataToPDF(userProfile);
  return res.json({ message: outputpath });
};

const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });

    if (!connectionUser) {
      return res.status(400).json({ message: "user not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request ALready sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();

    return res.json({ message: "Request Sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyConnectionsRequests = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");

    return res.json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const whatAreMyConnection = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name username email profilePicture");

    return res.json({ connections });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection  = await ConnectionRequest.findOne({_id: requestId});
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    if(action_type === "accept"){
      connection.status_accepted = true;
    }else{
      connection.status_accepted = false;
    }

    await connection.save();

    return res.json({message: "Request Updated"});
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
module.exports = {
  login,
  register,
  uploadProfilePicture,
  updateUserProfile,
  getUserProfile,
  getAllUserProfiles,
  updateProfileData,
  downloadProfile,
  sendConnectionRequest,
  getMyConnectionsRequests,
  whatAreMyConnection,
  acceptConnectionRequest
};
