import React, { useEffect, useState } from "react";
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
  getMySentRequests,
  sendConnectionRequest,
  whatAreMyConnection,
} from "@/config/redux/action/authAction";
import WorkHistory from "@/components/Profile/WorkHistory/workHistory";
import PostImageOpen from "@/components/Post/postImage/postImageOpen";
export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const postReducer = useSelector((state) => state.posts);

  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [relationship, setRelationship] = useState("NONE");
  const [isImageOpen, setIsImageOpen] = useState(null);

  const getUsersPost = async () => {
    await dispatch(getAllPosts());
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    dispatch(getMyConnetionRequest({ token }));
    dispatch(whatAreMyConnection({ token }));
    dispatch(getMySentRequests({ token }));
  }, [dispatch]);

  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPosts(post);
  }, [postReducer.posts]);

  useEffect(() => {
    if (
      !authState.connections ||
      !authState.pendingRequests ||
      !authState.sentRequests
    )
      return;

    const profileUserId = userProfile.userId._id;

    const isConnected = authState.connections.some(
      (conn) => conn.user?._id === profileUserId
    );

    if (isConnected) {
      setRelationship("CONNECTED");
      return;
    }

    const isPendingSent = authState.sentRequests?.some(
      (req) => req.receiver?._id === profileUserId
    );

    if (isPendingSent) {
      setRelationship("PENDING_SENT");
      return;
    }

    const isPendingReceived = authState.pendingRequests?.some(
      (req) => req.sender?._id === profileUserId
    );

    if (isPendingReceived) {
      setRelationship("PENDING_RECEIVED");
      return;
    }

    setRelationship("NONE");
  }, [
    authState.connections,
    authState.pendingRequests,
    authState.sentRequests,
    userProfile.userId._id,
  ]);

  useEffect(() => {
    getUsersPost();
  }, [dispatch]);
  return (
    <UserLayout>
      <DashboardLayout hideRight>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.profileContainerPicture}
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt=""
              onClick={() => setIsImageOpen(`${BASE_URL}/${userProfile.userId.profilePicture}`)}
            />
          </div>

          <div>
            <ProfileHeader profile={userProfile} />

            <div className={styles.connectionStatus}>
              {relationship === "CONNECTED" && (
                <button className={styles.connectedButton}>Connected</button>
              )}

              {relationship === "PENDING_SENT" && (
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button className={styles.connectedButton}>Pending</button>
                  <button
                    className={styles.rejectButton}
                    onClick={() => {
                      // TODO: withdraw request API later
                      console.log("Withdraw request");
                    }}
                  >
                    Withdraw
                  </button>
                </div>
              )}

              {relationship === "PENDING_RECEIVED" && (
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button className={styles.connectedButton}>Pending</button>
                  <button
                    className={styles.acceptButton}
                    onClick={() => router.push("/connections")}
                  >
                    Respond
                  </button>
                </div>
              )}

              {relationship === "NONE" && (
                <button
                  className={styles.connectedButton}
                  // disabled={isSendingRequest}
                  onClick={async () => {
                    setIsSendingRequest(true);

                    await dispatch(
                      sendConnectionRequest({
                        token: localStorage.getItem("token"),
                        receiverId: userProfile.userId._id,
                      })
                    );
                    dispatch(
                      getMySentRequests({
                        token: localStorage.getItem("token"),
                      })
                    );
                  }}
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
          <WorkHistory work={userProfile.pastWork} />
        </div>
        {isImageOpen && (
          <PostImageOpen
            isImageOpen
            onCloseImage={() => setIsImageOpen(null)}
            openPostImage={isImageOpen}
          />
        )}
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
