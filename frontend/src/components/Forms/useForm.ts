import { useState } from "react";

interface UseFormReturn {
  username: string;
  password: string;
  handleInput: React.ChangeEventHandler<HTMLInputElement>;
}

function useForm(): UseFormReturn {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = input.value;

    if(input.name === "username") setUsername(value);
    else if(input.name === "password") setPassword(value);
  };

  return {
    username,
    password,
    handleInput,
  };
}

export default useForm; 
