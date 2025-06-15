import { AxiosError } from 'axios';

export function getAxiosErrorMessage(error: AxiosError | null) {
  if (!error) return undefined;
  const data = error?.response?.data;
  if (data) {
    if (typeof data === 'object' && 'message' in data) {
      return data.message as string;
    } else if (typeof data === 'string') {
      return data;
    }
  } else if (error.message) {
    return error.message;
  } else {
    return 'Unknown error';
  }
}
