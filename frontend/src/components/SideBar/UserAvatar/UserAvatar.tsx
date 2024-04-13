import classNames from "classnames";

import styles from "./UserAvatar.module.scss";

interface UserAvatarProps {
  avatar: string;
  status?: {
    isOnline: boolean;
  }
}

function UserAvatar({ avatar, status }: UserAvatarProps) {
  const getStatus = () => {
    if(!status) return null;

    const statusDotClass = classNames(
      { [styles.online]: status.isOnline },
      styles.statusDot
    );

    return (
      <span className={statusDotClass}></span>
    );
  };

  return (
    <div className={styles.userAvatar}>
      <img
        className={styles.avatar}
        src={avatar}
        alt="User's avatar"
      />
      { getStatus() }
    </div>
  );
}

export default UserAvatar;
