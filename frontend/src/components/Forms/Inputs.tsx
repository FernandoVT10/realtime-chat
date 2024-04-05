import styles from "./Form.module.scss";

import { USER_CONFIG } from "shared/constants";

interface UsernameInputProps {
  autoComplete: HTMLInputElement["autocomplete"];
  username: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
}

export function UsernameInput({
  autoComplete,
  username,
  handleChange,
  placeholder,
}: UsernameInputProps) {
  return (
    <div className={styles.inputContainer}>
      <label
        className={styles.label}
        htmlFor="username-input"
      >
        Username
      </label>

      <input
        className={styles.input}
        id="username-input"
        type="text"
        name="username"
        maxLength={USER_CONFIG.usernameMaxLength}
        placeholder={placeholder}
        value={username}
        onChange={handleChange}
        autoComplete={autoComplete}
        required
      />
    </div>
  );
}

interface PasswordInputProps {
  autoComplete: HTMLInputElement["autocomplete"];
  password: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
}

export function PasswordInput({
  autoComplete,
  password,
  handleChange,
  placeholder,
}: PasswordInputProps) {
  return (
    <div className={styles.inputContainer}>
      <label
        className={styles.label}
        htmlFor="password-input"
      >
        Password
      </label>

      <input
        className={styles.input}
        id="password-input"
        type="password"
        name="password"
        maxLength={USER_CONFIG.passwordMaxLength}
        placeholder={placeholder}
        value={password}
        onChange={handleChange}
        autoComplete={autoComplete}
        required
      />
    </div>
  );
}
