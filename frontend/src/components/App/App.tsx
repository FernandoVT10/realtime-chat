import { useState } from "react";
import { CreateAccount, Login } from "../Forms";

import styles from "./App.module.scss";

function App() {
  const [creatingAccount, setCreatingAccount] = useState(true);

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
