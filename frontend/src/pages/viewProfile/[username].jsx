import React, { useEffect, useReducer, useState } from "react";
import { BASE_URL, clientServer } from "@/config";
import UserLayout from "@/layouts/userLayouts";
import DashboardLayout from "@/layouts/DashboardLayout";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getAllPosts } from "@/config/redux/action/postAction";
import ProfileHeader from "@/components/Profile/ProfileHeader/profileHeader";
import {
  getMyConnetionRequest,
  sendConnectionRequest,
  whatAreMyConnection,
} from "@/config/redux/action/authAction";
import WorkHistory from "@/components/Profile/WorkHistory/workHistory";
console;

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const postReducer = useSelector((state) => state.posts);

  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUsersPost = async (req, res) => {
    await dispatch(getAllPosts());
    await dispatch(
      getMyConnetionRequest({ token: localStorage.getItem("token") })
    );
    await dispatch(
      whatAreMyConnection({ token: localStorage.getItem("token") })
    );
  };

  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPosts(post);
  }, [postReducer.posts]);

  useEffect(() => {
    if (!authState.connections || !authState.pendingRequests) return;

    const profileUserId = userProfile.userId._id;
    const isConnected = authState.connections.some(
      (conn) => conn.user?._id === profileUserId
    );

    const isPending = authState.pendingRequests.some(
      (req) => req.sender?._id === profileUserId
    );

    if (isConnected) {
      setIsCurrentUserInConnection(true);
      setIsConnectionNull(false);
    } else if (isPending) {
      setIsCurrentUserInConnection(true);
      setIsConnectionNull(true);
    } else {
      setIsCurrentUserInConnection(false);
      setIsConnectionNull(true);
    }
  }, [authState.connections, authState.pendingRequests]);

  useEffect(() => {
    getUsersPost();
  }, []);
  return (
    <UserLayout>
      <DashboardLayout hideRight>
        <div className={styles.container}>
          {/* <div className={styles.profileContainer_details}>
            <div className={styles.container1}>
              <img
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt=""
            />
            <div className={styles.profileContainer_flex}>
              <div style={{ flex: "0.8" }}>
                <div className={styles.profileNameAndUsername}>
                  <h4 className={styles.userName}>{userProfile.userId.name}</h4>
                  <p>
                    @{userProfile.userId.username}
                  </p>
                </div>
                <div className={styles.connectionStatus}>
                  {isCurrentUserInConnection ? (
                    <button className={styles.connectedButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        await dispatch(
                          sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            connectionId: userProfile.userId._id,
                          })
                        );
                      }}
                      className={styles.connectedButton}
                    >
                      Connect
                    </button>
                  )}
                  <div style={{ width: "1.2em" }}>
                    <svg
                      onClick={async () => {
                        const response = await clientServer.get(
                          `downloadResume?id=${userProfile.userId._id}`
                        );
                        window.open(
                          `${BASE_URL}/${response.data.message}`,
                          "_blank"
                        );
                      }}
                      style={{ cursor: "pointer" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            </div>
            
            <div>
              <p>{userProfile.bio}</p>
            </div>
          </div> */}
          <div className={styles.backDropContainer}>
            <img
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt=""
            />
          </div>

          <div>
            <ProfileHeader profile={userProfile} />

            <div className={styles.connectionStatus}>
              {isCurrentUserInConnection ? (
                <button className={styles.connectedButton}>
                  {isConnectionNull ? "Pending" : "Connected"}
                </button>
              ) : (
                // <button
                //   onClick={async () => {
                //     await dispatch(
                //       sendConnectionRequest({
                //         token: localStorage.getItem("token"),
                //         receiverId: userProfile.userId._id,
                //       })
                //     );
                //     await dispatch(
                //       getMyConnetionRequest({
                //         token: localStorage.getItem("token"),
                //       })
                //     );
                //   }}
                //   className={styles.connectedButton}
                // >
                //   Connect
                // </button>

                <button
                  onClick={async () => {
                    await dispatch(
                      sendConnectionRequest({
                        token: localStorage.getItem("token"),
                        receiverId: userProfile.userId._id,
                      })
                    );

                    // refetch pending requests
                    const result = await dispatch(
                      getMyConnetionRequest({
                        token: localStorage.getItem("token"),
                      })
                    );

                    // recompute button state immediately
                    const profileUserId = userProfile.userId._id;
                    const updatedPendingRequests = result.payload || [];

                    const isPending = updatedPendingRequests.some(
                      (req) => req.sender?._id === profileUserId
                    );

                    if (isPending) {
                      setIsCurrentUserInConnection(true);
                      setIsConnectionNull(true);
                    }
                  }}
                  className={styles.connectedButton}
                >
                  Connect
                </button>
              )}
              <div style={{ width: "1.2em" }}>
                <svg
                  onClick={async () => {
                    const response = await clientServer.get(
                      `downloadResume?id=${userProfile.userId._id}`
                    );
                    window.open(
                      `${BASE_URL}/${response.data.message}`,
                      "_blank"
                    );
                  }}
                  style={{ cursor: "pointer" }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* <div className={styles.workHistory}>
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
            </div>
          </div> */}
          <WorkHistory work={userProfile.pastWork} />
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  const request = await clientServer.get("/get_any_user_profile", {
    params: {
      username: context.query.username,
    },
  });

  const response = await request.data;

  return {
    props: {
      userProfile: request.data.profile,
    },
  };
}
