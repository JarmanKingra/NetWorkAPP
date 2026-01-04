import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layouts/userLayouts";

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <div className={styles.wrapper}>
        <div className={styles.hero}>
          <div className={styles.left}>
            <span className={styles.tag}>Your Digital Network</span>
            <h1>
              Build real <br />
              <span>connections</span>
            </h1>
            <p>
              A modern social platform to connect, share ideas,
              and grow your professional network.
            </p>

            <div
              onClick={() => router.push("/login")}
              className={styles.cta}
            >
              Join Now
            </div>
          </div>

          <div className={styles.right}>
            <img src="/images/homemain_connection.jpg" alt="network" />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
