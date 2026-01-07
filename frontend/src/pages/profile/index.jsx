import React, { useEffect, useState } from "react";

import styles from "./index.module.css";
import UserLayout from "@/layouts/userLayouts";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getAboutUser } from "@/config/redux/action/authAction";
import { BASE_URL, clientServer } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import EditProfileModal from "@/components/Profile/EditProfile/editProfile";
import { EditPencilIcon } from "@/components/SvgIcons/profileSvgs";
import ProfileHeader from "@/components/Profile/ProfileHeader/profileHeader";
import WorkHistory from "@/components/Profile/WorkHistory/workHistory";

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();

  const postReducer = useSelector((state) => state.posts);
  const authState = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [inputData, SetInputData] = useState({
    company: "",
    position: "",
    years: "",
  });

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    SetInputData({ ...inputData, [name]: value });
  };

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);
      let post = postReducer.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
      });
      setUserPosts(post);
    }
  }, [authState.user, postReducer.posts]);

  const updateProfilePicture = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("profile_picture", file);
      formData.append("token", localStorage.getItem("token"));

      const response = await clientServer.post(
        "/update_profile_picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = async (data) => {
    try {
      setLoading(true);
      const request = await clientServer.post("/update_user", {
        token: localStorage.getItem("token"),
        name: data.name,
      });

      const response = await clientServer.post("/update_profile_data", {
        token: localStorage.getItem("token"),
        bio: data.bio,
        currentPost: userProfile.currentPost,
        pastWork: userProfile.pastWork,
        education: userProfile.education,
      });

      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addWorkHistory = async () => {
  try {
    setLoading(true);

    const updatedPastWork = [...userProfile.pastWork, inputData];

    await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: updatedPastWork,
      education: userProfile.education,
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    setIsModalOpen(false);

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <UserLayout>
      <DashboardLayout hideRight>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <label
                htmlFor="profilePictureUpload"
                className={styles.backDrop_overlay}
              >
                <p>Edit</p>
              </label>
              <input
                onChange={(e) => {
                  updateProfilePicture(e.target.files[0]);
                }}
                hidden
                type="file"
                id="profilePictureUpload"
              />
              <img
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt=""
              />
            </div>

            {/* <div className={styles.profileContainer_details}>
              <div className={styles.profileContainer_profileInfo}>
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "fit-content",
                      alignItems: "start",
                      gap: ".3rem",
                    }}
                  >
                    <p className={styles.nameEdit}>{userProfile.userId.name}</p>
                  </div>

                  <div className={styles.HeadLineContainer}>
                    <p className={styles.HeadLine}>{userProfile.bio}</p>
                  </div>
                </div>
                <div
                  className={styles.editProfilePencilIcon}
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  <EditPencilIcon />
                </div>
              </div>
            </div> */}

            <ProfileHeader
              profile={userProfile}
              isEditable
              onEditClick={() => setIsEditProfileOpen(true)}
            />

            {/* <div className={styles.workHistory}>
              <div className={styles.workHistoryHeaders}>
                <p>Work History</p>
                <button
                  className={styles.addWorkButton}
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  <p>Add Work</p>
                </button>
              </div>

              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork.map((work, index) => (
                  <div key={index} className={styles.workHistoryCard}>
                    <div className={styles.workLeft}>
                      <div className={styles.companyLogo}>
                        {work.company.charAt(0)}
                      </div>
                    </div>

                    <div className={styles.workRight}>
                      <p className={styles.position}>{work.position}</p>

                      <p className={styles.company}>{work.company}</p>

                      <p className={styles.duration}>{work.years}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            <WorkHistory
              work={userProfile.pastWork}
              editable
              onAddWork={() => setIsModalOpen(true)}
            />
          </div>
        )}

        {isModalOpen && (
          <div
            onClick={async () => {
              setIsModalOpen(false);
            }}
            className={styles.editWorkHIstoryContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.allCommentsContainer}
            >
              <input
                onChange={handleWorkInputChange}
                className={styles.inputField}
                name="company"
                type="text"
                placeholder="Enter Company"
              />
              <input
                onChange={handleWorkInputChange}
                className={styles.inputField}
                name="position"
                type="text"
                placeholder="Enter Position"
              />
              <input
                onChange={handleWorkInputChange}
                className={styles.inputField}
                name="years"
                type="number"
                placeholder="Years"
              />

              <div onClick={addWorkHistory}
                // onClick={() => {
                //   setUserProfile({
                //     ...userProfile,
                //     pastWork: [...userProfile.pastWork, inputData],
                //   });
                //   setIsModalOpen(false);
                // }}
                className={styles.updateProfileButton}
              >
                Add Work
              </div>
            </div>
          </div>
        )}

        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          initialData={{
            name: userProfile?.userId?.name,
            bio: userProfile?.bio,
          }}
          onSave={async (data) => {
            await updateProfileData(data);
            console.log(data);
            setIsEditProfileOpen(false);
          }}
          spinner={loading}
        />
      </DashboardLayout>
    </UserLayout>
  );
}
