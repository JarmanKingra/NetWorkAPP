import styles from "../../../pages/profile/index.module.css"

export default function WorkHistory({
  work,
  editable = false,
  onAddWork,
}) {
  return (
    <div className={styles.workHistory}>
      <div className={styles.workHistoryHeaders}>
        <p>Work History</p>

        {editable && (
          <button className={styles.addWorkButton} onClick={onAddWork}>
            <p>Add Work</p>
          </button>
        )}
      </div>

      <div className={styles.workHistoryContainer}>
        {work.map((item, index) => (
          <div key={index} className={styles.workHistoryCard}>
            <div className={styles.workLeft}>
              <div className={styles.companyLogo}>
                {item.company.charAt(0)}
              </div>
            </div>

            <div className={styles.workRight}>
              <p className={styles.position}>{item.position}</p>
              <p className={styles.company}>{item.company}</p>
              <p className={styles.duration}>{item.years}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
