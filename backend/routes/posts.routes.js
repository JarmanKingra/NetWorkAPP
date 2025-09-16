const { Router } = require("express");
const multer = require("multer");
const { activeCheck, createPost, getAllPosts, deletePost, incrementLikes, deleteCommentOfUser, getCommentByPosts, comment } = require("../controllers/posts.controller");



const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {  
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

router.route("/").get(activeCheck);

router.route("/post").post(upload.single('media'), createPost);
router.route("/getAllPost").get(getAllPosts);
router.route("/deletePost").delete(deletePost);
router.route("/comment").post(comment);
router.route("/get_comments_by_post").get(getCommentByPosts);
router.route("/delete_comments").delete(deleteCommentOfUser);
router.route("/incriment_like").post(incrementLikes);
 
module.exports = router;