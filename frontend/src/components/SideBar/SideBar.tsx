import { useModal } from "../Modal";
import { useState, useEffect, useContext } from "react";
import { UserProfile, FriendProfile, Message } from "shared/types";

import SocketContext from "../../SocketContext";
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
  selectedFriend: UserProfile | undefined;
  setSelectedFriend: (friend: UserProfile) => void;
}

function SideBar({ user, selectedFriend, setSelectedFriend }: SideBarProps) {
  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const socket = useContext(SocketContext);
  const addFriendModal = useModal();
  const pendingRequestsModal = useModal();

  const fetchFriends = async () => {
    try {
      const res = await axiosInstance.get<{ friends: FriendProfile[] }>("/friends");

      setFriends(res.data.friends);
    } catch (error) {
      setError(getFirstErrorMessage(error));
    }

    setLoading(false);
  };

  const handleSelectFriend = (friend: FriendProfile) => {
    setFriends(friends.map(f => {
      // mark messages as read
      if(f._id === friend._id) f.pendingMessagesCount = 0;

      return f;
    }));

    setSelectedFriend(friend);
  };

  useEffect(() => {
    fetchFriends();

    const listener = (createdMessage: Message) => {
      if(selectedFriend?._id === createdMessage.createdBy) return;

      setFriends(friends => friends.map(f => {
        // mark messages as read
        if(f._id === createdMessage.createdBy) f.pendingMessagesCount++;

        return f;
      }));
    };

    socket.on("new-message", listener);

    return () => {
      socket.removeListener("new-message", listener);
    };
  }, [selectedFriend]);

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
            const classFriend = classNames(styles.friend, {
              [styles.selected]: selectedFriend?._id === friend._id,
            });

            return (
              <div
                className={classFriend}
                onClick={() => handleSelectFriend(friend)}
                key={friend._id}
              >
                <div className={styles.profile}>
                  <UserAvatar avatar={friend.avatar} status={{ isOnline: true }} />
                  <span className={styles.username}>{friend.username}</span>
                </div>
                {friend.pendingMessagesCount > 0 && (
                  <span className={styles.pendingMessages}>{friend.pendingMessagesCount}</span>
                )}
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
