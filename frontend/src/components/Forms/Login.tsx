import { useState } from "react";
import { PasswordInput, UsernameInput } from "./Inputs";
import { RiErrorWarningFill } from "react-icons/ri";

import axiosInstance from "../../axios";
import getFirstErrorMessage from "../../utils/getFirstErrorMessage";
import useForm from "./useForm";
import classNames from "classnames";
import Spinner from "../Spinner";

import styles from "./Form.module.scss";

interface LoginResponse {
  token: string;
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

      saveAuthToken(res.data.token);

      window.location.reload();
    } catch (error) {
      setError(getFirstErrorMessage(error));

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
            <Spinner size={50}/>
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
          className={classNames(styles.submitButton, "custom-submit-button")}
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
