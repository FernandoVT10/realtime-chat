import { useState, useEffect } from "react";
import { CreateAccount, Login } from "../Forms";
import { RiSettings5Fill } from "react-icons/ri";

import styles from "./App.module.scss";
import classNames from "classnames";
import axiosInstance from "../../axios";

interface UserAvatarProps {
  avatar: string;
  isOnline: boolean;
}

function UserAvatar({ avatar, isOnline }: UserAvatarProps) {
  const statusDotClass = classNames(
    { [styles.online]: isOnline },
    styles.statusDot
  );

  return (
    <div className={styles.userAvatar}>
      <img
        className={styles.avatar}
        src={avatar}
        alt="User's avatar"
      />
      <span className={statusDotClass}></span>
    </div>
  );
}

interface UserInfoProps {
  avatar: string;
  username: string;
}

function UserInfo({ avatar, username }: UserInfoProps) {
  return (
    <div className={styles.userInfo}>
      <div className={styles.profile}>
        <UserAvatar avatar={avatar} isOnline/>

        <div className={styles.details}>
          <span className={styles.username}>{ username }</span>
          <span className={styles.status}>Online</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => console.log("Settings!")}
        className={styles.settingsButton}
      >
        <RiSettings5Fill className={styles.icon}/>
      </button>
    </div>
  );
}

interface SideBarProps extends UserInfoProps {}

function SideBar({ avatar, username }: SideBarProps) {
  return (
    <div className={styles.sideBar}>
      <div className={styles.chat}>
        <UserAvatar avatar="avatar-2.png" isOnline />
        <span className={styles.username}>Bocchi The Rock</span>
      </div>
      <div className={styles.chat}>
        <UserAvatar avatar="avatar.jpg" isOnline={false} />
        <span className={styles.username}>Frieren</span>
      </div>

      <UserInfo
        avatar={avatar}
        username={username}
      />
    </div>
  );
}

function App() {
  const [creatingAccount, setCreatingAccount] = useState(true);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  
  useEffect(() => {
    const getProfile = async () => {
      const token = window.localStorage.getItem("token");

      const res = await axiosInstance.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data.data;

      setUsername(user.username);
      setAvatar(user.avatar);
    };

    getProfile();
  }, []);


  return <SideBar avatar={avatar} username={username}/>;

  return (
    <div>
      <div className={styles.formContainer}>
        {creatingAccount ? (
          <CreateAccount goToLogin={() => setCreatingAccount(false)}/>
        ) : (
          <Login goToCreateAccount={() => setCreatingAccount(true)}/>
        )}

      </div>
    </div>
  );
}

export default App;
