import Modal, { useModal } from "../Modal";
import { RiSettings5Fill } from "react-icons/ri";
import { useState } from "react";
import { toast } from "react-toastify";

import classNames from "classnames";
import axiosInstance from "../../axios";

import styles from "./SideBar.module.scss";

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

              {/*TODO: Share styles with the submit button of the form*/}
              {newAvatar && (
                <button
                  type="submit"
                  className={styles.submitButton}
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
        <UserAvatar avatar={avatar} isOnline/>

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

export default SideBar;
