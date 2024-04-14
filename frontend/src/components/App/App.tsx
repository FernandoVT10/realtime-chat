import { useState, useEffect } from "react";
import { CreateAccount, Login } from "../Forms";
import { UserProfile } from "shared/types";

import axiosInstance from "../../axios";
import SideBar from "../SideBar";
import Spinner from "../Spinner";
import styles from "./App.module.scss";

function App() {
  const [user, setUser] = useState<UserProfile | undefined>();
  const [loading, setLoading] = useState(true);

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
    return <SideBar avatar={user.avatar} username={user.username}/>;
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
