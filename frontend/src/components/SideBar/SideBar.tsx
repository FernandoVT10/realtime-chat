import { useModal } from "../Modal";
import { useState, useEffect } from "react";
import { UserProfile } from "shared/types";

import UserAvatar from "./UserAvatar";
import AddFriendModal from "./AddFriendModal";
import UserInfo from "./UserInfo";
import axiosInstance from "../../axios";

import styles from "./SideBar.module.scss";

interface SideBarProps {
  user: UserProfile;
}

function SideBar({ user }: SideBarProps) {
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const addFriendModal = useModal();

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axiosInstance.get<{ friends: UserProfile[] }>("/friends");

        setFriends(res.data.friends);
      } catch (error) {
        // TODO: handle this error correctly
        console.error(error);
      }
    };

    getFriends();
  }, []);

  return (
    <div className={styles.sideBar}>
      <AddFriendModal modal={addFriendModal}/>

      <div>
        <button type="button">
          Pending friend requests
        </button>

        <button type="button" onClick={addFriendModal.showModal}>
          Add a new friend
        </button>
      </div>
      
      <h3 className={styles.subtitle}>Friends</h3>

      <div className={styles.friends}>
        {friends.map(friend => {
          return (
            <div className={styles.friend} key={friend._id}>
              <UserAvatar avatar={friend.avatar} status={{ isOnline: true }} />
              <span className={styles.username}>{friend.username}</span>
            </div>
          );
        })}
      </div>

      <UserInfo
        avatar={user.avatar}
        username={user.username}
      />
    </div>
  );
}

export default SideBar;
