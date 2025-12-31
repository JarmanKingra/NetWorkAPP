import {
  deletePost,
  getAboutUser,
  getAllUsers,
} from "@/config/redux/action/authAction";
import {
  createPost,
  getAllPosts,
  getComments,
  incrementLikes,
  postComment,
} from "@/config/redux/action/postAction";
import DashboardLayout from "@/layouts/DashboardLayout";
import UserLayout from "@/layouts/userLayouts";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { resetPostId } from "@/config/redux/reducer/postReducer";

export default function Dashboard() {
  const authState = useSelector((state) => state.auth);

  const postState = useSelector((state) => state.posts);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setfileContent] = useState();
  const [commentText, setCommentText] = useState("");

  const dispatch = useDispatch();

  const handleUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }));
    await dispatch(getAllPosts());
    setPostContent("");
    setfileContent();
  };

  useEffect(() => {
    if (authState.TokenIsThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.TokenIsThere]);

//   useEffect(() => {
//   if (!authState.TokenIsThere) return;

//   if (!authState.user) {
//     dispatch(getAboutUser());
//   }

//   dispatch(getAllPosts());

//   if (!authState.all_profiles_fetched) {
//     dispatch(getAllUsers());
//   }
// }, [authState.TokenIsThere]);



  if (authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.scrollComponent}>
            <div className={styles.wrapper}>
              <div className={styles.createPostContainer}>
                <img
                  className={styles.userProfile}
                  width={200}
                  src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
                  alt=""
                />
                <textarea
                  onChange={(e) => setPostContent(e.target.value)}
                  value={postContent}
                  className={styles.textAreaOfContent}
                  name=""
                  id=""
                ></textarea>
                <label htmlFor="fileUpload">
                  <div className={styles.Fab}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </div>
                </label>
                <input
                  onChange={(e) => setfileContent(e.target.files[0])}
                  type="file"
                  hidden
                  id="fileUpload"
                />
                {postContent.length > 0 && (
                  <div onClick={handleUpload} className={styles.uploadButton}>
                    Post
                  </div>
                )}
              </div>

              <div className={styles.postsContainer}>
                {postState.posts.map((post) => {
                  return (
                    <div key={post._id} className={styles.singleCard}>
                      <div className={styles.singleCard_profileContainer}>
                        {/* <img
                          className={styles.profilePicture}
                          src={`${BASE_URL}/${post.userId.profilePicture}`}
                          alt=""
                        /> */}
                        <div className={styles.postInfo}>
                         
                         <div className={styles.postInfoPicAndName}>
                            <img
                          className={styles.profilePicture}
                          src={`${BASE_URL}/${post.userId.profilePicture}`}
                          alt=""
                        />
                           <div>
                             <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p style={{ fontWeight: "bold" }}>
                                {post.userId.name}
                              </p>

                              {post.userId._id == authState.user.userId._id && (
                                <div>
                                  <svg
                                    onClick={async () => {
                                      await dispatch(
                                        deletePost({ postId: post._id })
                                      );
                                      await dispatch(getAllPosts());
                                    }}
                                    style={{
                                      height: "25px",
                                      color: "red",
                                      cursor: "pointer",
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="size-6"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    ></path>
                                    <path
                                      fill="#282828"
                                      d="M145.832 86.998c-1.1 0-2-.9-2-2 0-12.7-10.3-23-23-23-7.4 0-14.5 3.6-18.8 9.7-.6.9-1.9 1.1-2.8.5-.9-.6-1.1-1.9-.5-2.8 5.1-7.1 13.3-11.4 22.1-11.4 14.9 0 27 12.1 27 27 0 1.1-.9 2-2 2z"
                                    ></path>
                                  </svg>
                                </div>
                              )}
                            </div>
                            
                             </div>
                             <p>@{post.userId.username}</p>
                             </div>
                            </div>
                          
                          
                          <p style={{ paddingTop: "1.3rem" }}>{post.body}</p>

                          <div className={styles.singleCard_image}>
                            <img src={`${BASE_URL}/${post.media}`} alt="" />
                          </div>

                          <div className={styles.optionsContainer}>
                            <div
                              className={styles.singleOption_optionsContainer}
                            >
                              <svg
                                onClick={async () => {
                                  await dispatch(
                                    incrementLikes({ postId: post._id })
                                  );
                                  await dispatch(getAllPosts());
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill={
                                  post.likedBy.includes(
                                    authState.user.userId._id
                                  )
                                    ? "red"
                                    : "none"
                                }
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="size-6"
                                style={{ cursor: "pointer" }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5
                            -1.935 0-3.597 1.126-4.312 2.733
                                -.715-1.607-2.377-2.733-4.313-2.733
       C5.1 3.75 3 5.765 3 8.25
       c0 7.22 9 12 9 12s9-4.78 9-12z"
                                />
                              </svg>

                              <p>{post.likes}</p>
                            </div>
                            <div
                              className={styles.singleOption_optionsContainer}
                            >
                              <svg
                                onClick={async () => {
                                  await dispatch(
                                    getComments({ postId: post._id })
                                  );
                                  await dispatch(getAllPosts());
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-6"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                                />
                              </svg>
                            </div>
                            <div
                              className={styles.singleOption_optionsContainer}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-6"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {postState.postId !== "" && (
            <div
              onClick={async () => {
                await dispatch(resetPostId());
              }}
              className={styles.commentsContainer}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={styles.allCommentsContainer}
              >
                {postState.comments.length === 0 && <p>No comments yet</p>}

                {postState.comments.length != 0 && (
                  <div className={styles.allCommentsContainerr}>
                    {postState.comments.map((comment, index) => {
                      return (
                        <div className={styles.singleComment} key={comment._id}>
                          <div
                            className={styles.singleComment_profileContainer}
                          >
                            <img
                              src={`${BASE_URL}/${comment.userId.profilePicture}`}
                            />
                            <div>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "1.2rem",
                                }}
                              >
                                {comment.userId.name}
                              </p>
                              <p style={{ opacity: "0.7" }}>
                                @{comment.userId.username}
                              </p>
                            </div>
                          </div>
                          <p>{comment.body}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className={styles.postCommentContainer}>
                  <input
                    type=""
                    value={commentText}
                    placeholder="comment"
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div
                    onClick={async () => {
                      await dispatch(
                        postComment({
                          postId: postState.postId,
                          body: commentText,
                        })
                      );
                      await dispatch(getComments({ postId: postState.postId }));
                    }}
                    className={styles.postCommentContainer_commentBtn}
                  >
                    <p>Comment</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DashboardLayout>
      </UserLayout>
    );
  } else {
    return (
      <UserLayout>
        <DashboardLayout>
          <h3>Loading</h3>
        </DashboardLayout>
      </UserLayout>
    );
  }
}
