import styles from "../../../pages/profile/index.module.css"
import { EditPencilIcon } from "@/components/SvgIcons/profileSvgs";

export default function ProfileHeader({
  profile,
  isEditable = false,
  onEditClick,
  rightSlot,
}) {
  return (
    <div className={styles.profileContainer_details}>
      <div className={styles.profileContainer_profileInfo}>
        <div style={{ flex: "0.8" }}>
          <p className={styles.nameEdit}>{profile.userId.name}</p>

          <div className={styles.HeadLineContainer}>
            <p className={styles.HeadLine}>{profile.bio}</p>
          </div>
        </div>

        {isEditable && (
          <div onClick={onEditClick} className={styles.editProfilePencilIcon}>
            <EditPencilIcon />
          </div>
        )}
        {rightSlot && rightSlot}
      </div>
    </div>
  );
}
