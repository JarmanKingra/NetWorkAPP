import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "@/config";
import styles from "../../../pages/dashboard/index.module.css";
import { getComments, postComment } from "@/config/redux/action/postAction";
import ButtonSpinner from "@/components/loaders/loading";

export default function CommentsModal({ post, onClose }) {
  const dispatch = useDispatch();
  const { postId, comments } = post;
  const [commentText, setCommentText] = useState("");
  const [expandedComments, setExpandedComments] = useState({});
  const [isPosting, setIsPosting] = useState(false);
  const Max_length = 180;

  const handleCommentUpload = async () => {
    if (isPosting) return;

    try {
      setIsPosting(true);
      await dispatch(
        postComment({
          postId,
          body: commentText,
        }),
      );
      await dispatch(getComments({ postId }));
    } finally {
      setCommentText("")
      setIsPosting(false);
    }
  };

  return (
    <div onClick={onClose} className={styles.commentsContainer}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={styles.allCommentsContainer}
      >
        {comments.length === 0 && <p>No comments yet</p>}
        {comments.length != 0 && <p style={{paddingBottom: "1rem"}}>All Comments</p>}

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
          {commentText.length > 0 && (
            <div
            onClick={handleCommentUpload}
            className={styles.postCommentContainer_commentBtn}
          >
            {isPosting ? <ButtonSpinner text="Posting..." /> : "Comment"}
          </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
