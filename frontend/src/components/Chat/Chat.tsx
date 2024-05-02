import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { UserProfile, Message as MessageType, MessagesPagination } from "shared/types";
import { toast } from "react-toastify";

import SendMessageForm from "./SendMessageForm";
import SocketContext from "../../SocketContext";
import UserAvatar from "../SideBar/UserAvatar";
import Spinner from "../Spinner";
import classNames from "classnames";
import axiosInstance from "../../axios";
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

interface ChatProps {
  selectedFriend: UserProfile | undefined;
  user: UserProfile;
}

interface PaginationData {
  limit: MessagesPagination["limit"];
  messagesCount: MessagesPagination["messagesCount"];
  offset: number;
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

function Chat({ selectedFriend, user }: ChatProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingNewData, setLoadingNewData] = useState(false);

  const socket = useContext(SocketContext);

  const previousScrollHeight = useRef(0);
  const previousScrollPos = useRef(0);
  const fetchByScrolling = useRef(false);
  const paginationData = useRef<PaginationData>();

  const addMessage = useCallback((newMessage: MessageType) => {
    setMessages(messages => [...messages, newMessage]);
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      if(!selectedFriend || loading) return;

      setLoading(true);

      try {
        const res = await axiosInstance.get<MessagesPagination>("/messages", {
          params: { friendId: selectedFriend._id },
        });

        setMessages(res.data.messages);

        paginationData.current = {
          limit: res.data.limit,
          messagesCount: res.data.messagesCount,
          offset: 0,
        };

        fetchByScrolling.current = false;
      } catch {
        // TODO: create a svg to illustrate this error
        toast.error("There was an error trying to get the messages");
      }

      setLoading(false);
    };

    getMessages();

    const onNewMessage = (createdMessage: MessageType, cb: (data: unknown) => void) => {
      if(createdMessage.createdBy === selectedFriend?._id) {
        addMessage(createdMessage);
        cb({ read: true });
      }
    };

    socket.on("new-message", onNewMessage);

    return () => {
      socket.removeListener("new-message", onNewMessage);
    };
  }, [selectedFriend]);

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");

    if(!messageContainer) return;

    const { scrollHeight } = messageContainer;

    if(fetchByScrolling.current) {
      // If the new messages were fetch by scrolling up, we want to restore the previous scroll position.
      // This code will keep the messages that were displayed on screen in the same position with this
      // we will avoid weird jumps after the new messages are added.
      const newMessagesHeight = scrollHeight - previousScrollHeight.current;
      messageContainer.scroll({ top:  newMessagesHeight + previousScrollPos.current });
    } else {
      messageContainer.scroll({ top: scrollHeight });
    }
  }, [messages]);

  const onScroll: React.UIEventHandler<HTMLDivElement> = async (e) => {
    const element = e.target as HTMLDivElement;
    previousScrollHeight.current = element.scrollHeight;
    previousScrollPos.current = element.scrollTop;

    if(loadingNewData || element.scrollTop > 500 || !paginationData.current || !selectedFriend)
      return;

    const { offset, limit, messagesCount } = paginationData.current;

    // when there are no messages left, we just return
    const newOffset = offset + limit;
    if(messagesCount - newOffset < 1) return;

    setLoadingNewData(true);

    try {
      const res = await axiosInstance.get<{ messages: MessageType[] }>("/messages", {
        params: { friendId: selectedFriend._id, offset: newOffset },
      });

      const newMessages = res.data.messages;
      setMessages(messages => newMessages.concat(messages));

      paginationData.current.offset = newOffset;
      fetchByScrolling.current = true;
    } catch {
      toast.error("There was an error trying to get new messages");
    }

    setLoadingNewData(false);
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

  if(loading) {
    return (
      <div className={styles.loader}>
        <Spinner size={80}/>
      </div>
    );
  }

  return (
    <div className={styles.chat}>
      <div className={styles.messagesContainer} onScroll={onScroll} id="message-container">
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
