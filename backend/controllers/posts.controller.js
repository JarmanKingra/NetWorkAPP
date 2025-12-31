const Comment = require("../models/comments.model");
const Post = require("../models/posts.model");
const User = require("../models/users.model");
const Profile = require("../models/profile.model");

const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Running" });
};

const createPost = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType:
        req.file != undefined ? req.file.originalname.split(".")[1] : "",
    });

    await post.save();
    return res.status(200).json({ message: "Post Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email profilePicture"
    );
    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  const { token, postId } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (user._id.toString() !== post.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.deleteOne({ _id: postId });

    return res.json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const comment = async (req, res) => {
  const { token, post_Id, commentBody } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.findOne({ _id: post_Id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      userId: user._id,
      postId: post_Id,
      body: commentBody,
    });

    await newComment.save();
    return res
      .status(201)
      .json({ message: "comment created", comment: newComment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCommentByPosts = async (req, res) => {
  const { postId } = req.query;

  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const comment = await Comment.find({ postId: postId }).populate(
      "userId",
      "username name profilePicture"
    );

    return res.json(comment.reverse());
  } catch (error) {}
};

const deleteCommentOfUser = async (req, res) => {
  const { token, commentId } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.userId.toString() != user._id.toString()) {
      return res.status(404).json({ message: "Unauthorised" });
    }
    await Comment.deleteOne({ _id: commentId });

    return res.status(201).json({ message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const incrementLikes = async (req, res) => {
  const { postId, token} = req.body;
  const user = await User.findOne({ token });
  const userId = user._id;

  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    const isLiked = await post.likedBy.includes(userId);

    if (!isLiked) {
      post.likes = post.likes + 1;
      post.likedBy.push(userId);
    } else {
      post.likes = post.likes - 1;
      post.likedBy.pull(userId);
    }

    await post.save();

    return res.status(200).json({
      likes: post.likes,
      isLiked: !isLiked,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const get_user_profile_user_based_on_username = async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );

    return res.json({ profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  activeCheck,
  createPost,
  getAllPosts,
  deletePost,
  comment,
  getCommentByPosts,
  deleteCommentOfUser,
  incrementLikes,
  get_user_profile_user_based_on_username,
};
