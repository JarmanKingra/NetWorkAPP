import React, { useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

export default function NavBarComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1 className={styles.logo} onClick={() => router.push("/")}>
          NetworkAPP
        </h1>

        {/* Hamburger Icon for Mobile */}
        <div
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* Nav Links */}
        <div
          className={`${styles.navOptions} ${menuOpen ? styles.navActive : ""}`}
        >
          {authState.profileFetched && (
            <div className={styles.authOptions}>
              <p
                className={styles.navLink}
                onClick={() => {
                  router.push("/profile");
                  setMenuOpen(false);
                }}
              >
                Profile
              </p>
              <p
                className={styles.navLink}
                onClick={() => {
                  localStorage.removeItem("token");
                  dispatch(reset());
                  router.push("/login");
                  setMenuOpen(false);
                }}
              >
                LogOut
              </p>
            </div>
          )}

          {/* {authState.loggedIn && (
            <div
              className={styles.buttonJoin}
              onClick={() => {
                router.push("/login");
                setMenuOpen(false);
              }}
            >
              Be a part
            </div>
          )} */}
        </div>
      </nav>
    </div>
  );
}
