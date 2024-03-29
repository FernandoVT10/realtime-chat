import styles from "./Form.module.scss";

const USERNAME_MAX_LENGTH = 25;

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
        maxLength={USERNAME_MAX_LENGTH}
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
        placeholder={placeholder}
        value={password}
        onChange={handleChange}
        autoComplete={autoComplete}
        required
      />
    </div>
  );
}
