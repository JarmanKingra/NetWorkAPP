import React, { useEffect, useState } from "react";
import styles from "./editProfile.module.css";
import ButtonSpinner from "@/components/loaders/loading";

export default function EditProfileModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  spinner,
}) {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });
  


  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        bio: initialData.bio || "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.commentsContainer} onClick={onClose}>
      <div
        className={styles.allCommentsContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Edit Profile</h3>

        <input
          className={styles.inputField}
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="Name"
        />

        <textarea
          className={styles.inputField}
          rows={4}
          value={formData.bio}
          onChange={(e) =>
            setFormData({ ...formData, bio: e.target.value })
          }
          placeholder="Bio"
        />

        <div
          className={styles.updateProfileButton}
          onClick={() => onSave(formData)}
        >
          {spinner ? <ButtonSpinner text="Saving..." /> : "Save Changes"}
        </div>
      </div>
    </div>
  );
}
