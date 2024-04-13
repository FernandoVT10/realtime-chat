import { AxiosError } from "axios";

const INTERNAL_SERVER_ERROR = "There was an error trying to complete your request. Try it again later.";

type BadRequestError = {
  field: string;
  message: string;
};

const getFirstErrorMessage = (error: unknown): string => {
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

export default getFirstErrorMessage;
