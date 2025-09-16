
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layouts/userLayouts";



export default function Home() {

  const router = useRouter();
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
            <p>Connect with friends.</p>
            <p>A true social media platform for you.</p>
            <div 
            onClick={() => {
              router.push("/login");
            }}
            className={styles.buttonJoin}>
              <p>Join now</p>
            </div>
          </div>
          <div className={styles.mainContainer_right}>
            <img src="images/homemain_connection.jpg" alt="" />
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
