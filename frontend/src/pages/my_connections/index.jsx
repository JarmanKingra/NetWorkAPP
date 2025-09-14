import DashboardLayout from "@/layouts/DashboardLayout";
import UserLayout from "@/layouts/userLayouts";
import React, { useEffect } from "react";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { acceptConnectionRequest, whatAreMyConnection } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";


export default function MyConnections() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
     dispatch(whatAreMyConnection({ token: localStorage.getItem("token") })); // who who send me 
  }, []);

  useEffect(() => {
    if (authState.connectionRequests.length !== 0) {
      console.log(authState.connectionRequests);
    }
  }, [authState.connectionRequests]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div style={{display: "flex", flexDirection: "column", gap:"1.7rem"}}>
          <h3>Connections</h3>
         

      {authState.connectionRequests.length == 0  && <h2>No Connection Requests</h2> }

          {authState.connectionRequests.length != 0 &&
            authState.connectionRequests.filter((connection) => connection.status_accepted === null).map((user, index) => {  // 
              {console.log("user is --- ", user)}
                 return (
                
                <div onClick={() => {
                  router.push(`/viewProfile/${user.userId.username}`)
                }}
                 className={styles.userCard} key={index}>
                  {console.log("Rendering user:", user)}
                  <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                    
                    <div className={styles.profilePicture}>
                      <img
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt=""
                      />
                    </div>
                    <div className={styles.userInfo}>
                      
                      <h3>{user.userId.name}</h3> 
                      <p>{user.userId.username}</p>
                    </div>
                    <button onClick={async(e) => {
                      e.stopPropagation();
                      await dispatch(acceptConnectionRequest({
                        token : localStorage.getItem('token'),
                        connectionId: user._id,
                        action: "accept"
                      })),
                      await dispatch(whatAreMyConnection({token: localStorage.getItem('token')}))
                    }
                      
                    }
                     
                  
                     className={styles.connectedButton}>Accept</button>
                  </div>
                </div>
              );
            })}

<p>My Network</p>
            {authState.connectionRequests.length != 0 &&
            authState.connectionRequests.filter((connection) => connection.status_accepted !== null).map((user, index) => {
              return (
                
                <div onClick={() => {
                  router.push(`/viewProfile/${user.userId.username}`)
                }}
                 className={styles.userCard} key={index}>
                  {console.log("Rendering user:", user)}
                  <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                    
                    <div className={styles.profilePicture}>
                      <img
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt=""
                      />
                    </div>
                    <div className={styles.userInfo}>
                      
                      <h3>{user.userId.name}</h3>
                      <p>{user.userId.username}</p>
                    </div>
                    
                  </div>
                </div>
              );
            })}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
