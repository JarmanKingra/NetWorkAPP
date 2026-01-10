import React from "react";

export default function connectionAndDonwloadProfile() {
  return (
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
            window.open(`${BASE_URL}/${response.data.message}`, "_blank");
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
  );
}
