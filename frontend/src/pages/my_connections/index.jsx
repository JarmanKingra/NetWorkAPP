import DashboardLayout from "@/layouts/DashboardLayout";
import UserLayout from "@/layouts/userLayouts";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";
import {
  acceptConnectionRequest,
  whatAreMyConnection,
  getMyConnetionRequest,
} from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function MyConnections() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("requests");

  useEffect(() => {
    const token = localStorage.getItem("token");

    dispatch(getAboutUser({ token }));
    dispatch(whatAreMyConnection({ token }));
    dispatch(getMyConnetionRequest({ token: localStorage.getItem("token") }));
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.pageContainer}>
          <div className={styles.switchContainer}>
            <div
              className={`${styles.switchOption} ${
                activeTab === "requests" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("requests")}
            >
              Requests
            </div>

            <div
              className={`${styles.switchOption} ${
                activeTab === "connections" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("connections")}
            >
              Connections
            </div>
          </div>

          {activeTab === "requests" && (
            <>
              <h3 className={styles.sectionTitle}>Pending Requests</h3>

              {authState.pendingRequests?.length === 0 && (
                <p className={styles.emptyText}>No pending requests</p>
              )}

              {authState.pendingRequests?.map((req) => {
                const sender = req.sender;

                return (
                  <div
                    onClick={() =>
                      router.push(`/viewProfile/${sender.username}`)
                    }
                    className={styles.userCard}
                    key={req._id}
                  >
                    <div className={styles.cardRow}>
                      <div className={styles.profilePicture}>
                        <img
                          src={`${BASE_URL}/${sender.profilePicture}`}
                          alt=""
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h3>{sender.name}</h3>
                        <p>{sender.username}</p>
                      </div>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await dispatch(
                            acceptConnectionRequest({
                              token: localStorage.getItem("token"),
                              requestId: req._id,
                              action: "accept",
                            })
                          ).then(() => {
                            dispatch(
                              getMyConnetionRequest({
                                token: localStorage.getItem("token"),
                              })
                            );
                            dispatch(
                              whatAreMyConnection({
                                token: localStorage.getItem("token"),
                              })
                            );
                          });
                        }}
                        className={styles.connectedButton}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {activeTab === "connections" && (
            <>
              <h3 className={styles.sectionTitle}>My Network</h3>

              {authState.connections?.length === 0 && (
                <p className={styles.emptyText}>No connections yet</p>
              )}

              {authState.connections.map((conn) => {
                const user = conn.user;

                return (
                  <div
                    key={conn._id}
                    className={styles.userCard}
                    onClick={() => router.push(`/viewProfile/${user.username}`)}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                      }}
                    >
                      <div className={styles.profilePicture}>
                        <img
                          src={`${BASE_URL}/${user.profilePicture}`}
                          alt=""
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h3>{user.name}</h3>
                        <p>{user.username}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
