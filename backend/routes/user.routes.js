const { Router } = require("express");
const {
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  getUserProfile,
  updateProfileData,
  downloadProfile,
  sendConnectionRequest,
  getMyConnectionsRequests,
  getMySentRequests,
  whatAreMyConnection,
  acceptConnectionRequest,
  getAllUserProfiles
} = require("../controllers/user.controller");
const multer = require("multer");
const { get_user_profile_user_based_on_username } = require("../controllers/posts.controller");

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), uploadProfilePicture);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update_user").post(updateUserProfile);
router.route("/get_user_profile").get(getUserProfile);
router.route("/get_All_user_profiles").get(getAllUserProfiles);
router.route("/get_any_user_profile").get(get_user_profile_user_based_on_username);
router.route("/update_profile_data").post(updateProfileData);
router.route("/downloadResume").get(downloadProfile);
router.route("/send_connetion_request").post(sendConnectionRequest);
router.route("/my_sent_requests").post(getMySentRequests);
router.route("/get_My_Connection_Requests").get(getMyConnectionsRequests);
router.route("/what_Are_My_Connection").get(whatAreMyConnection);
router.route("/accept_Connection_Request").post(acceptConnectionRequest);

module.exports = router;
