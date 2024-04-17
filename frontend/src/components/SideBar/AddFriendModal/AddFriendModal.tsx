import { useState } from "react";
import Modal, { UseModalReturn } from "../../Modal";
import { UserProfile } from "shared/types";
import { USER_CONFIG } from "shared/constants";
import { toast } from "react-toastify";
import {
  IconSearch,
  IconUserPlus,
  IconAlertCircleFilled,
  IconCircleCheckFilled
} from "@tabler/icons-react";

import classNames from "classnames";
import UserAvatar from "../UserAvatar";
import axiosInstance from "../../../axios";
import getFirstErrorMessage from "../../../utils/getFirstErrorMessage";
import Spinner from "../../Spinner";

import sharedStyles from "../shared.module.scss";
import styles from "./AddFriendModal.module.scss";

interface UserProps {
  user: UserProfile;
  sendFriendRequest: (userId: string) => Promise<boolean>;
}

type RequestStatus = "failed" | "sent" | null;

function User({ user, sendFriendRequest }: UserProps) {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [sendingRequest, setSendingRequest] = useState(false);

  const handleSendRequest = async () => {
    setSendingRequest(true);

    const res = await sendFriendRequest(user._id);
    setRequestStatus(res ? "sent" : "failed");
    
    setSendingRequest(false);
  };

  const getButton = () => {
    if(requestStatus === "sent") {
      return (
        <IconCircleCheckFilled className={sharedStyles.successIcon} size={25}/>
      );
    } else if(requestStatus === "failed") {
      return (
        <IconAlertCircleFilled className={sharedStyles.errorIcon} size={25}/>
      );
    }

    if(sendingRequest) return <Spinner size={20}/>;

    return (
      <button
        type="button"
        className={classNames(sharedStyles.button, "custom-submit-button")}
        onClick={handleSendRequest}
      >
        <span className={sharedStyles.text}>Add Friend</span>
        <IconUserPlus size={18} className={sharedStyles.icon}/>
      </button>
    );
  };

  return (
    <div className={sharedStyles.user}>
      <div className={sharedStyles.userInfo}>
        <UserAvatar avatar={user.avatar}/>
        <span className={sharedStyles.username}>{user.username}</span>
      </div>

      {getButton()}
    </div>
  )
}

interface UsersProps {
  users: UserProfile[];
  loadingUsers: boolean;
  usersNotFound: boolean;
  error: string;
}

function Users({ users, loadingUsers, usersNotFound, error }: UsersProps) {
  const sendFriendRequest = async (userId: string) => {
    try {
      await axiosInstance.post("/friends/sendRequest", { friendId: userId });
      return true;
    } catch (error) {
      toast.error(getFirstErrorMessage(error));
      return false;
    }
  };

  if(loadingUsers) {
    return (
      <div className={sharedStyles.loader}>
        <Spinner size={30}/>
      </div>
    );
  }

  if(error) {
    return (
      <div className={sharedStyles.error}>
        { error }
      </div>
    );
  }

  if(usersNotFound) {
    return (
      <div className={sharedStyles.noData}>
        <p>Not users found</p>
      </div>
    );
  }

  return (
    <div className={sharedStyles.users}>
      {users.map(user => (
        <User
          user={user}
          sendFriendRequest={sendFriendRequest}
          key={user._id}
        />
      ))}
    </div>
  );
}

function AddFriendModal({ modal }: { modal: UseModalReturn }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersNotFound, setUsersNotFound] = useState(false);
  const [error, setError] = useState("");

  const handleSearch: React.FormEventHandler = async (e) => {
    e.preventDefault();

    if(loadingUsers) return;

    setLoadingUsers(true);

    try {
      const res = await axiosInstance.get<{ users: UserProfile[] }>("/users", {
        params: { search },
      });

      const users = res.data.users;
      setUsers(users);
      setUsersNotFound(users.length === 0);
    } catch {
      setError("There was an error trying to connect with the server.");
    }

    setLoadingUsers(false);
  };

  return (
    <Modal modal={modal} title="Add a Friend!">
      <div className={classNames(styles.addFriendModal, sharedStyles.container)}>
        <form onSubmit={handleSearch}>
          <div className={styles.searchForm}>
            <input
              type="text"
              placeholder="Enter a username"
              value={search}
              onChange={({ target: { value } }) => setSearch(value)}
              maxLength={USER_CONFIG.usernameMaxLength}
              className={styles.input}
            />

            <button
              type="submit"
              className={classNames("custom-submit-button", styles.button)}
            >
              <IconSearch size={18}/>
            </button>
          </div>
        </form>

        <Users
          users={users}
          loadingUsers={loadingUsers}
          usersNotFound={usersNotFound}
          error={error}
        />
      </div>
    </Modal>
  );
}

export default AddFriendModal;
