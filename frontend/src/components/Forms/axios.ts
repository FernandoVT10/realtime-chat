import axios, { AxiosError } from "axios";

const INTERNAL_SERVER_ERROR = "There was an error trying to complete your request. Try it again later.";
const API_URL = "http://localhost:3001/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});

type BadRequestError = {
  field: string;
  message: string;
};

export const getErrorMessage = (error: unknown): string => {
  if(error instanceof AxiosError) {
    if(error.response?.status === 400 && error.response.data) {
      const errors: BadRequestError[] | undefined = error.response.data.errors;

      if(Array.isArray(errors) && errors.length) {
        return errors[0].message;
      }
    }
  }

  return INTERNAL_SERVER_ERROR;
};
