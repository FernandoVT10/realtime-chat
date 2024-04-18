import { useModal } from "../Modal";
import { useState, useEffect } from "react";
import { UserProfile } from "shared/types";

import UserAvatar from "./UserAvatar";
import AddFriendModal from "./AddFriendModal";
import UserInfo from "./UserInfo";
import PendingRequests from "./PendingRequests";
import Spinner from "../Spinner";
import axiosInstance from "../../axios";
import getFirstErrorMessage from "../../utils/getFirstErrorMessage";
import classNames from "classnames";

import styles from "./SideBar.module.scss";

interface SideBarProps {
  user: UserProfile;
}

function SideBar({ user }: SideBarProps) {
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const addFriendModal = useModal();
  const pendingRequestsModal = useModal();

  const fetchFriends = async () => {
    try {
      const res = await axiosInstance.get<{ friends: UserProfile[] }>("/friends");

      setFriends(res.data.friends);
    } catch (error) {
      setError(getFirstErrorMessage(error));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const getFriendsComponent = () => {
    if(loading) {
      return (
        <div className={styles.statusContainer}>
          <Spinner size={30}/>
        </div>
      );
    }

    if(error) {
      return (
        <div className={styles.statusContainer}>
          <span className={styles.errorMessage}>{ error }</span>
        </div>
      );
    }

    if(!friends.length) {
      // TODO: Add a SVG instead
      return (
        <div className={styles.statusContainer}>
          <span className={styles.infoMessage}>You don't have friends :(</span>
        </div>
      );
    }

    return (
      <>
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
      </>
    );
  };

  return (
    <div className={styles.sideBar}>
      <AddFriendModal modal={addFriendModal}/>
      <PendingRequests modal={pendingRequestsModal} reFetchFriends={fetchFriends}/>

      <div className={styles.buttonsContainer}>
        <button
          type="button"
          onClick={pendingRequestsModal.showModal}
          className={classNames(styles.button, "custom-submit-button")}
        >
          Pending friends requests
        </button>

        <button
          type="button"
          onClick={addFriendModal.showModal}
          className={classNames(styles.button, "custom-submit-button")}
        >
          Add a new friend
        </button>
      </div>

      {getFriendsComponent()}

      <UserInfo
        avatar={user.avatar}
        username={user.username}
      />
    </div>
  );
}

export default SideBar;
