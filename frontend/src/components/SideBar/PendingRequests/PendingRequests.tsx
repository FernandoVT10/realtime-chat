import { useState, useEffect } from "react";
import { UserFriendRequest } from "shared/types";
import Modal, { UseModalReturn } from "../../Modal";
import { toast } from "react-toastify";
import { IconAlertCircleFilled, IconCheck } from "@tabler/icons-react";

import Spinner from "../../Spinner";
import UserAvatar from "../UserAvatar";
import axiosInstance from "../../../axios";
import getFirstErrorMessage from "../../../utils/getFirstErrorMessage";
import classNames from "classnames";

import sharedStyles from "../shared.module.scss";

type RemoveRequestFn = (requestId: string) => void;
type AcceptRequestFn = (requestId: string, username: string) => Promise<boolean>;

interface RequestProps {
  request: UserFriendRequest;
  acceptRequest: AcceptRequestFn;
}

function Request({ request, acceptRequest }: RequestProps) {
  const [loading, setLoading] = useState(false);
  const [requestFailed, setRequestFailed] = useState<boolean>(false);

  const handleAcceptRequest = async () => {
    setLoading(true);

    const { username } = request.user;
    const success = await acceptRequest(request._id, username);

    setRequestFailed(!success);

    setLoading(false);
  };

  const getButton = () => {
    if(loading) {
      return <Spinner size={20}/>;
    }

    if(requestFailed) {
      return (
        <IconAlertCircleFilled
          className={sharedStyles.errorIcon}
          size={25}
        />
      );
    }

    return (
      <button
        type="button"
        className={classNames(sharedStyles.button, "custom-submit-button")}
        onClick={handleAcceptRequest}
      >

        <span className={sharedStyles.text}>Accept Request</span>
        <IconCheck size={18} className={sharedStyles.icon}/>
      </button>
    );
  };

  const { user } = request; 

  return (
    <div className={sharedStyles.user}>
      <div className={sharedStyles.userInfo}>
        <UserAvatar avatar={user.avatar}/>
        <span className={sharedStyles.username}>{user.username}</span>
      </div>

      {getButton()}
    </div>
  );
}

interface UsersProps {
  loading: boolean;
  error: string;
  requests: UserFriendRequest[];
  removeRequest: RemoveRequestFn;
  reFetchFriends: () => Promise<void>;
}

function Requests({ loading, error, requests, removeRequest, reFetchFriends }: UsersProps) {
  const acceptRequest: AcceptRequestFn = async (requestId, username) => {
    try {
      await axiosInstance.post("/friends/acceptRequest", { friendRequestId: requestId });

      removeRequest(requestId);
      toast.success(`Now ${username} is your friend!`);

      await reFetchFriends();

      return true;
    } catch (error) {
      toast.error(getFirstErrorMessage(error));
      return false;
    }
  };

  if(loading) {
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

  if(!requests.length) {
    return (
      <div className={sharedStyles.noData}>
        <p>You don't have pending friends requests</p>
      </div>
    );
  }

  return (
    <div className={sharedStyles.users}>
      {requests.map(request => (
        <Request
          request={request}
          acceptRequest={acceptRequest}
          key={request._id}
        />
      ))}
    </div>
  );
}

interface PendingRequestsProps {
  modal: UseModalReturn;
  reFetchFriends: () => Promise<void>;
}

function PendingRequests({ modal, reFetchFriends }: PendingRequestsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState<UserFriendRequest[]>([]);
  const [fetchedRequests, setFetchedRequests] = useState(false);

  const removeRequest: RemoveRequestFn = (requestId) => {
    setRequests(
      requests.filter(request => request._id !== requestId)
    );
  };

  useEffect(() => {
    if(fetchedRequests || !modal.isActive) return;

    const fetchRequests = async () => {
      setLoading(true);
      setFetchedRequests(true);

      try {
        const res = await axiosInstance.get<{ requests: UserFriendRequest[] }>("/friends/requests");
        setRequests(res.data.requests);
      } catch (error) {
        setError(getFirstErrorMessage(error));
      }

      setLoading(false);
    };

    fetchRequests();
  }, [modal.isActive]);

  return (
    <Modal modal={modal} title="Pending Requests">
      <div className={sharedStyles.container}>
        <Requests
          loading={loading}
          requests={requests}
          removeRequest={removeRequest}
          error={error}
          reFetchFriends={reFetchFriends}
        />
      </div>
    </Modal>
  );
}

export default PendingRequests;
