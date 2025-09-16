import React, { useEffect, useState } from "react";

import styles from "./index.module.css";
import UserLayout from "@/layouts/userLayouts";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getAboutUser } from "@/config/redux/action/authAction";
import { BASE_URL, clientServer } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();

  const postReducer = useSelector((state) => state.posts);
  const authState = useSelector((state) => state.auth);
  // const userProfile = useSelector((state) => state.auth.user);
  const [userPosts, setUserPosts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userProfile, setUserProfile] = useState({});

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
  };

  const updateProfileData = async () => {
    const request = await clientServer.post("/update_user", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
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

            <div className={styles.profileContainer_details}>
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
                    
                      <input
                      className={styles.nameEdit}
                      type="text"
                      value={userProfile.userId.name}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        })
                      }
                    />

                    <p style={{ color: "grey" }}>
                      @{userProfile.userId.username}
                    </p>
                    
                  </div>

                  <div className={styles.textAreaBio}>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
                {/* <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>
                  
                  {userPosts.map((post) => {
                    return (
                      <div key={post._id} className={styles.postCard}>
                        <div className={styles.card}>
                          <div className={styles.card_profileContainer}>
                            {post.media !== "" ? (
                              <img src={`${BASE_URL}/${post.media}`} />
                            ) : (
                              <div
                                style={{ width: "3.4rem", height: "3.4rem" }}
                              ></div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })} 
                </div> */}
              </div>
            </div>

            <div className={styles.workHistory}>
              <h4>Work History</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork.map((work, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        {work.company} - {work.position}
                      </p>
                      <p>{work.years}</p>
                    </div>
                  );
                })}
                <button
                  className={styles.addWorkButton}
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Add Work
                </button>
              </div>
            </div>

            {userProfile !== authState.user && (
              <div
                onClick={() => {
                  updateProfileData();
                }}
                className={styles.updateProfileButton}
              >
                Update Profile
              </div>
            )}
          </div>
        )}

        {isModalOpen && (
          <div
            onClick={async () => {
              setIsModalOpen(false);
            }}
            className={styles.commentsContainer}
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

              <div
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    pastWork: [...userProfile.pastWork, inputData],
                  });
                  setIsModalOpen(false);
                }}
                className={styles.updateProfileButton}
              >
                Update Profile
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
