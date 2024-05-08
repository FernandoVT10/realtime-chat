import { useState, useEffect } from "react";
import { CreateAccount, Login } from "../Forms";
import { UserProfile } from "shared/types";
import { toast } from "react-toastify";

import socket from "../../config/socket";
import axiosInstance from "../../axios";
import SocketContext from "../../SocketContext";
import SideBar from "../SideBar";
import Spinner from "../Spinner";
import Chat from "../Chat";

import styles from "./App.module.scss";

function App() {
  const [user, setUser] = useState<UserProfile | undefined>();
  const [loading, setLoading] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState<UserProfile>();

  const [creatingAccount, setCreatingAccount] = useState(true);
  
  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await axiosInstance.get<UserProfile>("/user/profile");

        socket.connect();

        socket.on("connect_error", () => {
          toast.error("There was an error trying to connect to the server.");
        });

        setUser(res.data);
      } catch {}

      setLoading(false);
    };

    getProfile();
  }, []);

  if(loading) {
    return (
      <div className={styles.loaderContainer}>
        <Spinner size={50}/>
        <span className={styles.text}>We are authenticating you...</span>
      </div>
    );
  }

  if(user) {
    return (
      <SocketContext.Provider value={socket}>
        <div className={styles.appContainer}>
          <div className={styles.sideBarContainer}>
            <SideBar
              user={user}
              selectedFriend={selectedFriend}
              setSelectedFriend={setSelectedFriend}
            />
          </div>

          <div className={styles.chatContainer}>
            <Chat selectedFriend={selectedFriend} user={user}/>
          </div>
        </div>
      </SocketContext.Provider>
    );
  }

  return (
    <div>
      <div className={styles.formContainer}>
        {creatingAccount ? (
          <CreateAccount goToLogin={() => setCreatingAccount(false)}/>
        ) : (
          <Login goToCreateAccount={() => setCreatingAccount(true)}/>
        )}
      </div>
    </div>
  );
}

export default App;
