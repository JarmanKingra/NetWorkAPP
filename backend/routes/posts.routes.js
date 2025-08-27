const { Router } = require("express");
const multer = require("multer");
const { activeCheck, createPost } = require("../controllers/posts.controller");



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

router.route("/").get(activeCheck);
router.route("/post").post(upload.single('media'), createPost);

module.exports = router;