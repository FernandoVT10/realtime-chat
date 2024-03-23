import { useState } from "react";
import { PasswordInput, UsernameInput } from "./Inputs";
import { RiErrorWarningFill } from "react-icons/ri";

import axiosInstance from "../../axios";
import getErrorMessage from "./getErrorMessage";
import useForm from "./useForm";

import styles from "./Form.module.scss";

interface LoginResponse {
  data: {
    token: string;
  }
}

const saveAuthToken = (token: string): void => {
  window.localStorage.setItem("token", token);
};

function Login({ goToCreateAccount }: { goToCreateAccount: () => void }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { username, password, handleInput } = useForm();

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = { username, password };

      const res = await axiosInstance.post<LoginResponse>("/user/login", data);

      saveAuthToken(res.data.data.token);

      window.location.reload();
    } catch (error) {
      setError(getErrorMessage(error));

      setLoading(false);
    }
  };

  return (
    <div className={styles.form}>
      <form onSubmit={handleSubmit}>
        <h3>Login</h3>

        <UsernameInput
          username={username}
          handleChange={handleInput}
          autoComplete="username"
          placeholder="Enter your username"
        />

        <PasswordInput
          password={password}
          handleChange={handleInput}
          autoComplete="current-password"
          placeholder="Enter your password"
        />

        {loading && (
          <div className={styles.loader}>
            <span className={styles.spinner}></span>
          </div>
        )}

        {error.length > 0 && (
          <p className={styles.error}>
            <RiErrorWarningFill className={styles.icon}/>
            { error }
          </p>
        )}

        <button
          type="submit"
          className={styles.submitButton}
        >
          Login
        </button>

        <button
          type="button"
          className={styles.link}
          onClick={goToCreateAccount}
        >
          Need an account?
        </button>
      </form>
    </div>
  );
}

export default Login;
