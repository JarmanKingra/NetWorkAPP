import React, { useEffect, useReducer, useState } from "react";
import { BASE_URL, clientServer } from "@/config";
import UserLayout from "@/layouts/userLayouts";
import DashboardLayout from "@/layouts/DashboardLayout";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  getConnetionRequest,
  sendConnectionRequest,
  whatAreMyConnection,
} from "@/config/redux/action/authAction";

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const postReducer = useSelector((state) => state.posts);

  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUsersPost = async (req, res) => {
    await dispatch(getAllPosts());
    await dispatch(
      getConnetionRequest({ token: localStorage.getItem("token") })
    );
    await dispatch(whatAreMyConnection({ token: localStorage.getItem("token") }));
  };

  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPosts(post);
  }, [postReducer.posts]);

  useEffect(() => {
    if (  
      authState.connections.some(
        (user) => user.connectionId._id == userProfile.userId._id)) {
      setIsCurrentUserInConnection(true);

      if (
        authState.connections.find(
          user => user.connectionId._id === userProfile.userId._id).status_accepted == true
      ) {
        setIsConnectionNull(false);
      }
    }

    if (  
      authState.connectionRequests.some(
        (user) => user.userId._id == userProfile.userId._id)) {
      setIsCurrentUserInConnection(true);

      if (
        authState.connectionRequests.find(
          user => user.userId._id === userProfile.userId._id).status_accepted == true
      ) {
        setIsConnectionNull(false);
      }
    }
  }, [authState.connections]);

  useEffect(() => {
    getUsersPost();
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt=""
            />
          </div>

          <div className={styles.profileContainer_details}>
            <div style={{ display: "flex", gap: "0.7rem" }}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "grey" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
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

                <div>
                  <p>{userProfile.bio}</p>
                </div>
              </div>
              <div style={{ flex: "0.2" }}>
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
              </div>
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
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  console.log("From View");
  console.log(context.query.username);

  const request = await clientServer.get("/get_any_user_profile", {
    params: {
      username: context.query.username,
    },
  });

  const response = await request.data;
  console.log(response);

  return {
    props: {
      userProfile: request.data.profile,
    },
  };
}
