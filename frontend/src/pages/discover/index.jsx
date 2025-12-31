import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layouts/DashboardLayout";
import UserLayout from "@/layouts/userLayouts";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function Discover() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, []);

  console.log("authState", authState.all_users);

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1></h1>
          <div className={styles.allUserProfile}>
            <div className="allUsersProfiles">
              {authState.all_profiles_fetched &&
                authState.all_users.map((user) => {
                  return (
                    <div 
                    onClick={() => {
                      router.push(`/viewProfile/${user.userId.username}`)
                    }}
                    key={user._id} className={styles.userCard}>
                      <img
                        className={styles.userCard_image}
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt=""
                      />
                      <div>
                        <h1>{user.userId.name}</h1>
                        <p>{user.userId.username}</p>
                      </div>
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
