import React from "react";
import CommonImage from "@/components/atoms/CommonImage";
import CommonBadge from "@/components/atoms/CommonBadge/CommonBadge";
import styles from "./style.module.css";
import profileImage from "@/asset/images/Profile Image.png";

interface ProfileCardProps {
  rank?: number;
  username: string;
  description: string;
  accumulated: string;
  dailyAverage: string;
  period: string;
  tags?: string[];
  profileImageSrc?: string;
}

export default function ProfileCard({
  rank,
  username,
  description,
  accumulated,
  dailyAverage,
  period,
  tags = [],
  profileImageSrc,
}: ProfileCardProps) {
  const formatRank = (rank: number) => {
    if (rank >= 10000) {
      return `${rank.toLocaleString()}위`;
    }
    return `${rank}위`;
  };

  return (
    <div className={styles.profileCard}>
      <div className={styles.leftSection}>
        {rank && (
          <div className={styles.rankBadge}>
            <CommonBadge
              text={formatRank(rank)}
              variant="primary"
              size="medium"
            />
          </div>
        )}
        <div className={styles.profileImage}>
          <CommonImage
            src={profileImageSrc || profileImage}
            alt={username}
            width={64}
            height={64}
            className={styles.image}
          />
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.header}>
          <h3 className={styles.username}>{username}</h3>
        </div>
        <p className={styles.description}>{description}</p>

        <div className={styles.stats}>
          <span className={styles.statItem}>
            누적 <strong>{accumulated}</strong>
          </span>
          <span className={styles.statItem}>
            일 평균 <strong>{dailyAverage}</strong>
          </span>
          <span className={styles.statItem}>
            경력 <strong>{period}</strong>
          </span>
        </div>

        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <CommonBadge key={index} text={tag} variant="gray" size="small" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
