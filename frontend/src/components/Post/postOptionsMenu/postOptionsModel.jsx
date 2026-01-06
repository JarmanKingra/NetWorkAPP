import styles from "./PostOptionsModal.module.css";

export default function PostOptionsModal({
  isOpen,
  onClose,
  onDelete,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.optionBox}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={styles.deleteOption} onClick={onDelete}>
          Delete post
        </p>
      </div>
    </div>
  );
}
