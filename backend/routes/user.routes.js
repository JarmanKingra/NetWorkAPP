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
  whatAreMyConnection,
  acceptConnectionRequest,
  getAllUserProfiles
} = require("../controllers/user.controller");
const multer = require("multer");

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
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
router.route("/update_profile_data").post(updateProfileData);
router.route("/donwloadResume").get(downloadProfile);
router.route("/send_connetion_request").post(sendConnectionRequest);
router.route("/get_My_Connection_Requests").get(getMyConnectionsRequests);
router.route("/what_Are_My_Connection").get(whatAreMyConnection);
router.route("/accept_Connection_Request").get(acceptConnectionRequest);

module.exports = router;
