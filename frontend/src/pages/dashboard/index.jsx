import {
  deletePost,
  getAboutUser,
  getAllUsers,
} from "@/config/redux/action/authAction";
import {
  getAllPosts,
  getComments,
  incrementLikes,
} from "@/config/redux/action/postAction";
import DashboardLayout from "@/layouts/DashboardLayout";
import UserLayout from "@/layouts/userLayouts";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { resetPostId } from "@/config/redux/reducer/postReducer";
import PostOptionsModal from "@/components/Post/postOptionsMenu/postOptionsModel";
import PostImageOpen from "@/components/Post/postImage/postImageOpen";
import CommentsModal from "@/components/Post/Comments/commentsModal";
import {
  CommentIcon,
  LikeIcon,
  ShareIcon,
} from "@/components/SvgIcons/DashBoardSvgs";
import CreatePostModal from "@/components/Post/CreatePostModal/createPostModal";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const [openMenuPostId, setOpenMenuPostId] = useState(null);
  const [openImage, setOpenImage] = useState(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  


  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (authState.TokenIsThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.TokenIsThere]);
  console.log(postState.posts);

  if (authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.scrollComponent}>
            <div className={styles.wrapper}>
              <div
                className={styles.fakeCreatePost}
                onClick={() => setIsCreatePostOpen(true)}
              >
                <img
                  className={styles.userProfile}
                  src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
                  alt=""
                />
                <div className={styles.fakeInput}>Start a post</div>
              </div>

              <div className={styles.postsContainer}>
                {postState.posts.map((post) => {
                  return (
                    <div key={post._id} className={styles.singleCard}>
                      <div className={styles.singleCard_profileContainer}>
                        <div className={styles.postInfo}>
                          <div className={styles.postInfoPicAndName}
                          onClick={() => router.push(`/viewProfile/${post.userId.username}`)}
                          >
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
                                    gap: "3rem",
                                  }}
                                >
                                  <p className={styles.commentName}>
                                    {post.userId.name}
                                  </p>
                                </div>
                              </div>
                              <p className={styles.commentUserName}>
                                @{post.userId.username}
                              </p>
                            </div>
                          </div>

                          <p className={styles.postBody} style={{ paddingTop: "1.3rem" }}>{post.body}</p>

                          {post.media && (
                            <div className={styles.singleCard_image}>
                              <img
                                src={`${BASE_URL}/${post.media}`}
                                onClick={() =>
                                  setOpenImage(`${BASE_URL}/${post.media}`)
                                }
                                className={styles.postImage}
                              />
                            </div>
                          )}

                          <div className={styles.optionsContainer}>
                            <div
                              className={styles.singleOption_optionsContainer}
                            >
                              <LikeIcon
                                click={async () => {
                                  await dispatch(
                                    incrementLikes({ postId: post._id })
                                  );
                                  await dispatch(getAllPosts());
                                }}
                                fil={
                                  post.likedBy.includes(
                                    authState.user.userId._id
                                  )
                                    ? "red"
                                    : "none"
                                }
                              />

                              <p>{post.likes}</p>
                            </div>
                            <div
                              className={styles.singleOption_optionsContainer}
                            >
                              <CommentIcon
                                click={async () => {
                                  await dispatch(
                                    getComments({ postId: post._id })
                                  );
                                  await dispatch(getAllPosts());
                                }}
                              />
                              <p>{post.commentsCount}</p>
                            </div>
                            <div
                              className={styles.singleOption_optionsContainer}
                            >
                              <ShareIcon />
                            </div>
                          </div>
                          {post.userId._id == authState.user.userId._id && (
                            <div
                              className={styles.threeDot}
                              onClick={() => setOpenMenuPostId(post._id)}
                            >
                              ⋮
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {postState.postId !== "" && (
            <CommentsModal
              post={{
                postId: postState.postId,
                comments: postState.comments,
              }}
              onClose={async () => dispatch(resetPostId())}
            />
          )}

          {openMenuPostId && (
            <PostOptionsModal
              isOpen={true}
              onClose={() => setOpenMenuPostId(null)}
              onDelete={async () => {
                await dispatch(deletePost({ postId: openMenuPostId }));
                await dispatch(getAllPosts());
                setOpenMenuPostId(null);
              }}
            />
          )}

          {openImage && (
            <PostImageOpen
              isImageOpen={true}
              onCloseImage={() => setOpenImage(null)}
              openPostImage={openImage}
            />
          )}

          {isCreatePostOpen && (
            <CreatePostModal
              onClose={() => setIsCreatePostOpen(false)}
              onPostCreated={async () => {
                await dispatch(getAllPosts());
                setIsCreatePostOpen(false);
              }}
            />
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
