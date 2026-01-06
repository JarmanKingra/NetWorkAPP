import UserLayout from "@/layouts/userLayouts";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";
import ButtonSpinner from "@/components/loaders/loading";

function loginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [userLoginMethod, setuserLoginMethod] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [username, setusername] = useState("");
  const [name, setname] = useState("");
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  const handleRegister = async () => {
    await dispatch(registerUser({ username, name, password, email }));
  };

  const handleLogin = async () => {
    console.log("login..");
    await dispatch(loginUser({ email, password }));
  };
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>
              {userLoginMethod ? "SignIn" : "SignUp"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message.message}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (authState.isLoading) return;

                if (userLoginMethod) {
                  handleLogin();
                } else {
                  handleRegister();
                }
              }}
              className={styles.inputContainers}
            >
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setusername(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => setname(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                  />
                </div>
              )}
              <input
                onChange={(e) => setemail(e.target.value)}
                className={styles.inputField}
                type="text"
                placeholder="Email"
              />
              <input
                onChange={(e) => setpassword(e.target.value)}
                className={styles.inputField}
                type="text"
                placeholder="Password"
              />

              <button
                type="submit"
                className={styles.buttonWithOutline}
                disabled={authState.isLoading}
              >
                {authState.isLoading ? (
                  <ButtonSpinner
                    text={userLoginMethod ? "Logging in..." : "Registering..."}
                  />
                ) : (
                  <p>{userLoginMethod ? "SignIn" : "SignUp"}</p>
                )}
              </button>
            </form>
          </div>
          <div className={styles.cardContainer_right}>
            <div>
              {!userLoginMethod ? (
                <p>Already have a account?</p>
              ) : (
                <p>Don't have a account?</p>
              )}
              <div
                style={{ marginTop: "10px", textAlign: "center" }}
                onClick={() => {
                  setuserLoginMethod(!userLoginMethod);
                }}
                className={styles.buttonWithOutline}
              >
                <p style={{ color: "black" }}>
                  {userLoginMethod ? "SignUp" : "SignIn"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default loginComponent;
