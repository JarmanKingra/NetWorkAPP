import styles from "./styles.module.css";

export default function PostImageOpen({
  isImageOpen,
  onCloseImage,
  openPostImage,
}) {
  if (!isImageOpen) return null;

  return (
    <div className={styles.imageOverlay} onClick={onCloseImage}>
      <div className={styles.imageModal} onClick={(e) => e.stopPropagation()}>
        <img src={openPostImage} />
        <span className={styles.closeBtn} onClick={onCloseImage}>
          ✕
        </span>
      </div>
    </div>
  );
}
