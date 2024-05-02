import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { MESSAGE_CONFIG } from "shared/constants";
import { IconSend2 } from "@tabler/icons-react";
import { UserProfile, Message } from "shared/types";

import Spinner from "../Spinner";
import SocketContext from "../../SocketContext";
import classNames from "classnames";

import styles from "./Chat.module.scss";

interface SendMessageFormProps {
  friend: UserProfile;
  addMessage: (newMessage: Message) => void;
}

function SendMessageForm({ friend, addMessage }: SendMessageFormProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const socket = useContext(SocketContext);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setMessage(e.target.value);

  const sendMessage: React.FormEventHandler = async (e) => {
    e.preventDefault();

    if(!socket.connected) return toast.error("You are disconnected from the server");

    try {
      setLoading(true);
      const res = await socket.emitWithAck("send-message", message, friend._id);
      setLoading(false);

      if(res.status !== 200) throw new Error;

      addMessage(res.createdMessage);
      setMessage("");
    } catch {
      toast.error("There was an error trying to send your message");
    }
  };

  const sendMessageFormClass = classNames(styles.sendMessageForm, {
    [styles.loading]: loading,
  });

  return (
    <form onSubmit={sendMessage}>
      <div className={sendMessageFormClass}>
        <input
          className={styles.input}
          value={message}
          onChange={handleChange}
          placeholder={`Write a message to ${friend.username}`}
          maxLength={MESSAGE_CONFIG.contentMaxLength}
        />

        {loading ? (
          <div className={styles.loader}>
            <Spinner size={20}/>
          </div>
        ) : (
          <button
            className={styles.button}
            type="submit"
          >
            <IconSend2 size={25}/>
          </button>
        )}
      </div>
    </form>
  );
}

export default SendMessageForm;
