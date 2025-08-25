const User = require("../models/users.model");
const Profile = require("../models/profile.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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

    return res.json({ message: "User logged in", token });
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

    const {username, email} = newUserData;
    const existinguser = await User.findOne({$or: [{username}, {email}]});

    if(existinguser){
      if(existinguser || String(existinguser._id) !== String(user._id)){
        return res.status(400).json({message: "User Exists"});
      }
    }

    Object.assign(user, newUserData);
    await user.save();
    
    return res.json({ message: "Profile Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async(req, res) => {
  try {
    const {token} = req.body;
    const user = await User.findOne({token: token});
     if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const userProfile = await Profile.findOne({userId: user._id})
    .populate('userId', 'name username email profilePicture')

    return res.json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const updateProfileData = async(req, res) => {
  try {
    const{token, ...newProfileData} = req.body;
    const userProfile = await User.findOne({token: token});

    if(!userProfile){
      return res.status(400).json({ message: "user not found" });
    }

    const profileToUpdate = await Profile.findOne({userId: userProfile._id});

    Object.assign(profileToUpdate, newProfileData);

    await profileToUpdate.save();

    return res.json(profileToUpdate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const downloadProfile = async(req, res) => {
  const user_id = req.query.id;
  const userProfile = await Profile.findOne({userId: user_id})
  .populate('userId', 'name username email profilePicture');

  let a = await convertUserDataToPDF(userProfile);
  return res.json({"message": a});
}



module.exports = { login, register, uploadProfilePicture, updateUserProfile, getUserProfile, updateProfileData};
