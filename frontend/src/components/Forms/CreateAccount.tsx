import { useState } from "react";
import { RiErrorWarningFill, RiCheckboxCircleLine } from "react-icons/ri";
import { PasswordInput, UsernameInput } from "./Inputs";

import axiosInstance from "../../axios";
import getFirstErrorMessage from "../../utils/getFirstErrorMessage";
import useForm from "./useForm";
import classNames from "classnames";

import styles from "./Form.module.scss";

function CreateAccount({ goToLogin }: { goToLogin: () => void }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const { username, password, handleInput } = useForm();

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = { username, password };
      await axiosInstance.post("/user/create", data);

      setAccountCreated(true);

      setError("");
    } catch (error) {
      setError(getFirstErrorMessage(error));
    }

    setLoading(false);
  };

  return (
    <div className={styles.form}>
      <form onSubmit={handleSubmit}>
        <h3>Create Account</h3>

        {accountCreated && (
          <div className={styles.accountCreated}>
            <RiCheckboxCircleLine className={styles.icon}/>
            <h3 className={styles.message}>Account created successfully!</h3>
            <button
              className={styles.link}
              onClick={goToLogin}
            >
              Click here to go to login.
            </button>
          </div>
        )}

        <UsernameInput
          username={username}
          handleChange={handleInput}
          autoComplete="off"
          placeholder="Create a username"
        />

        <PasswordInput
          password={password}
          handleChange={handleInput}
          autoComplete="off"
          placeholder="Create a password"
        />

        {loading && (
          <div className={styles.loader}>
            <span className="spinner"></span>
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
          Create Account
        </button>

        <button
          type="button"
          className={styles.link}
          onClick={goToLogin}
        >
          Already have an account?
        </button>
      </form>
    </div>
  );
}

export default CreateAccount;
