import { useState, useEffect, useCallback, useRef } from "react";
import { UserProfile, Message as MessageType } from "shared/types";
import { toast } from "react-toastify";
import { IconSend2 } from "@tabler/icons-react";
import { MESSAGE_CONFIG } from "shared/constants";

import UserAvatar from "../SideBar/UserAvatar";
import Spinner from "../Spinner";
import classNames from "classnames";
import socket from "../../config/socket";
import styles from "./Chat.module.scss";

interface GroupedMessage {
  createdBy: MessageType["createdBy"];
  messages: string[];
}

interface MessageProps {
  messages: string[];
  author: UserProfile;
  isFriendMessage: boolean;
}

function Message({ messages, author, isFriendMessage }: MessageProps) {
  const messageContainerClass = classNames(styles.messageContainer, {
    [styles.isFriendMessage]: isFriendMessage,
  });

  return (
    <div className={messageContainerClass}>
      <div className={styles.author}>
        <UserAvatar avatar={author.avatar}/>
        <span className={styles.username}>{author.username}</span>
      </div>

      <div className={styles.messages}>
        {messages.map((message, index) => {
          return (
            <div className={styles.message} key={index}>
              {message}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface SendMessageFormProps {
  friend: UserProfile;
  addMessage: (newMessage: MessageType) => void;
}

function SendMessageForm({ friend, addMessage }: SendMessageFormProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

interface ChatProps {
  selectedFriend: UserProfile | undefined;
  user: UserProfile;
}

function Chat({ selectedFriend, user }: ChatProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);

  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.connect();

    socket.on("connect_error", () => {
      toast.error("There was an error trying to connect to the server.");
    });
  }, []);

  useEffect(() => {
    const listener = (createdMessage: MessageType) => {
      if(createdMessage.createdBy === selectedFriend?._id) {
        addMessage(createdMessage);
      }
    };

    socket.on("new-message", listener);

    return () => {
      socket.removeListener("new-message", listener);
    };
  }, [selectedFriend]);

  useEffect(() => {
    const getMessages = async () => {
      if(!selectedFriend || loading || !socket.connected) return;

      setLoading(true);

      const messages = await socket.emitWithAck("get-messages", selectedFriend._id);
      setMessages(messages);

      setLoading(false);
    };

    getMessages();
  }, [selectedFriend, socket.connected]);

  useEffect(() => {
    if(!messageContainerRef.current) return;

    const { scrollHeight } = messageContainerRef.current;
    messageContainerRef.current.scroll({ top: scrollHeight });
  }, [messages]);

  const addMessage = (newMessage: MessageType) => {
    setMessages(messages => [...messages, newMessage]);
  };

  const getGroupedMessages = useCallback(() => {
    const formattedMessages: GroupedMessage[] = [];

    let index = 0;

    for(const message of messages) {
      if(!formattedMessages[index]) {
        formattedMessages[index] = {
          createdBy: message.createdBy,
          messages: [message.content],
        };
      } else {
        if(formattedMessages[index].createdBy === message.createdBy) {
          formattedMessages[index].messages.push(message.content);
        } else {
          index++;

          formattedMessages[index] = {
            createdBy: message.createdBy,
            messages: [message.content],
          };
        }
      }
    }

    return formattedMessages;
  }, [messages]);

  if(!selectedFriend) return null;

  return (
    <div className={styles.chat}>
      <div className={styles.messagesContainer} ref={messageContainerRef}>
        {getGroupedMessages().map((message, index) => {
          const isFriendMessage = message.createdBy === selectedFriend._id;

          return (
            <Message
              key={index}
              messages={message.messages}
              author={isFriendMessage ? selectedFriend : user}
              isFriendMessage={isFriendMessage}
            />
          );
        })}
      </div>

      <SendMessageForm friend={selectedFriend} addMessage={addMessage}/>
    </div>
  );
}

export default Chat;
