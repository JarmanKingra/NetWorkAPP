import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";




export default function NavBarComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth); //state?.auth ?? {}
  const dispatch = useDispatch();

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1
          style={{ cursor: "pointer" }}
          onClick={() => {
            router.push("/");
          }}
        >
          NetworkAPP
        </h1> 
        <div className={styles.navBarOptionContainer}>

          {authState.profileFetched && <div>
            <div style={{display: "flex", gap: "1.2rem"}}>
              <p>Hey, {authState.user.userId.name}</p>
              <p style={{fontWeight: "bold", cursor: "pointer"}} pointe>Profile</p>
              <p onClick={ () => {localStorage.removeItem("token"),
               dispatch(reset())
               router.push("/login")
               
              }}
              style={{fontWeight: "bold", cursor: "pointer"}} pointe>LogOut</p>
            </div>
            </div>}
          
          {!authState.loggedIn && 
          <div
            onClick={() => {
             
                router.push("/login");
              
              
            }}
            className={styles.buttonJoin}
          >
            Be a part
          </div>
          }
          
          
        </div>
      </nav>
    </div>
  );
}
