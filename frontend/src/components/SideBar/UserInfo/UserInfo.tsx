import Modal, { useModal, UseModalReturn } from "../../Modal";
import { IconSettings } from "@tabler/icons-react";
import { toast } from "react-toastify";
import { useState } from "react";

import axiosInstance from "../../../axios";
import UserAvatar from "../UserAvatar";
import classNames from "classnames";
import styles from "./UserInfo.module.scss";

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

interface UpdateAvatarModalProps {
  updateAvatarModal: UseModalReturn;
  avatar: string;
  onUpdateAvatar: (newAvatar: string) => void;
}

function UpdateAvatarModal({ avatar, updateAvatarModal, onUpdateAvatar }: UpdateAvatarModalProps) {
  const [newAvatar, setNewAvatar] = useState<File>();
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [loading, setLoading] = useState(false);

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
        onUpdateAvatar(previewAvatar);
        updateAvatarModal.hideModal();
      }
    } catch {
      toast.error("Could not update the avatar");
    }

    setLoading(false);
  };

  return (
    <Modal title="User Settings" modal={updateAvatarModal}>
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
  );
}

interface UserInfoProps {
  avatar: string;
  username: string;
}

function UserInfo({ avatar: initialAvatar, username }: UserInfoProps) {
  const [avatar, setAvatar] = useState(initialAvatar);

  const updateAvatarModal = useModal();

  const onUpdateAvatar = (newAvatar: string) => setAvatar(newAvatar);

  return (
    <div className={styles.userInfo}>
      <UpdateAvatarModal
        avatar={avatar}
        updateAvatarModal={updateAvatarModal}
        onUpdateAvatar={onUpdateAvatar}
      />

      <div className={styles.profile}>
        <UserAvatar avatar={avatar} status={{ isOnline: true }}/>

        <div className={styles.details}>
          <span className={styles.username}>{ username }</span>
          <span className={styles.status}>Online</span>
        </div>
      </div>

      <button
        type="button"
        onClick={updateAvatarModal.showModal}
        className={styles.settingsButton}
      >
        <IconSettings size={22}/>
      </button>
    </div>
  );
}

export default UserInfo;
