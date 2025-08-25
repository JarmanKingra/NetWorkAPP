const { Router } = require("express");
const { register, login, uploadProfilePicture, updateUserProfile, getUserProfile, updateProfileData } = require("../controllers/user.controller");
const multer = require("multer")



const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "upload")
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    },
})

const upload = multer({storage: storage});

router.route("/update_profile_picture").post(upload.single("profile_picture"), uploadProfilePicture);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update_user").post(updateUserProfile);
router.route("/get_user_profile").post(getUserProfile);
router.route("/update_profile_data").post(updateProfileData);

module.exports = router;