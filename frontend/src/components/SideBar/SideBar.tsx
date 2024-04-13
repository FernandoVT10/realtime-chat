import Modal, { useModal } from "../Modal";
import { RiSettings5Fill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { UserProfile } from "shared/types";

import UserAvatar from "./UserAvatar";
import AddFriendModal from "./AddFriendModal";
import classNames from "classnames";
import axiosInstance from "../../axios";

import styles from "./SideBar.module.scss";

const readImageAsDataURL = (file: File): Promise<string> => {
  if(!file.type.startsWith("image/")) {
    throw new Error("The avatar must be an image");
  }

  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onerror = () => {
      reject(new Error("Error trying to process the image"));
    };

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };

    fileReader.readAsDataURL(file);
  });
};

interface UserInfoProps {
  avatar: string;
  username: string;
}

function UserInfo({ avatar, username }: UserInfoProps) {
  const [newAvatar, setNewAvatar] = useState<File>();
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  const settingsModal = useModal();

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;

    if(files && files.length > 0) {
      const file = files[0];

      try {
        setPreviewAvatar(await readImageAsDataURL(file));
        setNewAvatar(file);
      } catch (error) {
        if(error instanceof Error) toast.error(error.message);
      }
    } else {
      setPreviewAvatar("");
      setNewAvatar(undefined);
    }
  };

  const updateAvatar: React.FormEventHandler = async (e) => {
    e.preventDefault();

    if(!newAvatar) return;

    const formData = new FormData();
    formData.append("avatar", newAvatar);

    setLoading(true);

    try {
      const res = await axiosInstance.post("/user/updateAvatar", formData);

      if(res.status === 200) {
        toast.success("Avatar updated successfully!");
        settingsModal.hideModal();
      }
    } catch {
      toast.error("Could not update the avatar");
    }

    setLoading(false);
  };

  return (
    <div className={styles.userInfo}>
      <Modal title="User Settings" modal={settingsModal}>
        <div className={styles.settingsContainer}>
          <form onSubmit={updateAvatar}>
            <div className={styles.avatarSettings}>
              <input
                type="file"
                id="avatar-input"
                name="avatar-input"
                onChange={onFileChange}
                accept="image/*"
                className={styles.avatarInput}
              />

              <label className={styles.avatarLabel} htmlFor="avatar-input">
                <img
                  src={previewAvatar || avatar}
                  className={styles.previewAvatar}
                  alt="Preview of the new avatar"
                />
              </label>

              {newAvatar && (
                <button
                  type="submit"
                  className={classNames(styles.submitButton, "custom-submit-button")}
                  disabled={loading}
                >
                  {loading ? "Updating avatar..." : "Update Avatar"}
                </button>
              )}
            </div>
          </form>
        </div>
      </Modal>

      <div className={styles.profile}>
        <UserAvatar avatar={avatar} status={{ isOnline: true }}/>

        <div className={styles.details}>
          <span className={styles.username}>{ username }</span>
          <span className={styles.status}>Online</span>
        </div>
      </div>

      <button
        type="button"
        onClick={settingsModal.showModal}
        className={styles.settingsButton}
      >
        <RiSettings5Fill className={styles.icon}/>
      </button>
    </div>
  );
}

interface SideBarProps extends UserInfoProps {}

function SideBar({ avatar, username }: SideBarProps) {
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
        avatar={avatar}
        username={username}
      />
    </div>
  );
}

export default SideBar;
