import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "@/config";
import styles from "../../../pages/dashboard/index.module.css"
import { getComments, postComment } from "@/config/redux/action/postAction";

export default function CommentsModal({ post, onClose }) {
  const dispatch = useDispatch();
  const { postId, comments } = post;
  const [commentText, setCommentText] = useState("");
  const [expandedComments, setExpandedComments] = useState({});
  const Max_length = 180;
  return (
    <div onClick={onClose} className={styles.commentsContainer}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={styles.allCommentsContainer}
      >
        {comments.length === 0 && <p>No comments yet</p>}

        {comments.length != 0 && (
          <div className={styles.allCommentsContainerr}>
            {comments.map((comment, index) => {
              const isLong = comment.body.length > Max_length;
              const isExpanded = expandedComments[comment._id];
              return (
                <div className={styles.singleComment} key={comment._id}>
                  <div className={styles.singleComment_profileContainer}>
                    <img src={`${BASE_URL}/${comment.userId.profilePicture}`} />
                    <div>
                      <p className={styles.commentName}>
                        {comment.userId.name}
                      </p>
                      <p className={styles.commentUserName}>
                        @{comment.userId.username}
                      </p>
                    </div>
                  </div>
                  <p className={styles.commentBody}>
                    {isExpanded || !isLong
                      ? comment.body
                      : comment.body.slice(0, Max_length) + "..."}
                  </p>
                  {isLong && (
                    <span
                      onClick={() =>
                        setExpandedComments((prev) => ({
                          ...prev,
                          [comment._id]: !prev[comment._id],
                        }))
                      }
                      className={styles.seeMore}
                    >
                      {isExpanded ? "See less" : "See more"}
                    </span>
                  )}
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
                  postId,
                  body: commentText,
                }),
                setCommentText("")
              );
              await dispatch(getComments({ postId }));
            }}
            className={styles.postCommentContainer_commentBtn}
          >
            <p>Comment</p>
          </div>
        </div>
      </div>
    </div>
  );
}
