import { useState, useEffect } from "react";
import { CreateAccount, Login } from "../Forms";
import { UserProfile } from "shared/types";

import axiosInstance from "../../axios";
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
      <div className={styles.appContainer}>
        <SideBar user={user} selectFriend={setSelectedFriend}/>
        <Chat selectedFriend={selectedFriend} user={user}/>
      </div>
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
