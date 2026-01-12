import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./styles.module.css";
import { PlusIcon } from "@/components/SvgIcons/DashBoardSvgs";
import { createPost } from "@/config/redux/action/postAction";
import ButtonSpinner from "@/components/loaders/loading";
import PostImageOpen from "../postImage/postImageOpen";

export default function CreatePostModal({ onClose, onPostCreated }) {
  const dispatch = useDispatch();

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleUpload = async () => {
    if (isPosting) return;
    if (!postContent && !fileContent) return;

    try {
      setIsPosting(true);
      await dispatch(createPost({ file: fileContent, body: postContent }));
      await onPostCreated();
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <textarea
          placeholder="What do you want to talk about?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />

        <input
          type="file"
          hidden
          id="fileUpload"
          accept="image/*,video/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            setFileContent(file);
            setMediaPreview(URL.createObjectURL(file));
          }}
        />

        {mediaPreview && (
          <img
            src={mediaPreview}
            className={styles.preview}
            onClick={() => setIsImageOpen(true)}
            style={{ cursor: "pointer" }}
          />
        )}

        <div className={styles.postAndMediaIcon}>
          <button
            onClick={handleUpload}
            disabled={isPosting || (!postContent && !fileContent)}
            className={styles.postButton}
          >
            {isPosting ? <ButtonSpinner text="Posting..." /> : "Post"}
          </button>

          <div className={styles.mediaToolbar}>
            <label htmlFor="fileUpload" className={styles.mediaButton}>
              <PlusIcon />
            </label>
          </div>
        </div>

        <span onClick={onClose} className={styles.closeBtn}>
          ✕
        </span>
      </div>

      <PostImageOpen
        isImageOpen={isImageOpen}
        openPostImage={mediaPreview}
        onCloseImage={() => setIsImageOpen(false)}
      />
    </div>
  );
}
