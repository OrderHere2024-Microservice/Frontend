import * as Yup from 'yup';
import { AxiosError, AxiosInstance } from 'axios';

interface UniqueResponse {
  data: boolean;
}

Yup.addMethod<Yup.StringSchema>(
  Yup.string,
  'unique',
  function (message: string, axiosInstance: AxiosInstance) {
    return this.test('unique', message, async function (value) {
      if (!value) return true;

      try {
        const response = await axiosInstance.get<UniqueResponse>(value);
        const data = response.data;
        return data.data === true;
      } catch (error) {
        const axiosError = error as AxiosError;
        return this.createError({ message: axiosError.message });
      }
    });
  },
);

Yup.addMethod<Yup.StringSchema>(
  Yup.string,
  'sequence',
  function (funcList: Yup.StringSchema[]) {
    return this.test('sequence', '', async (value, context) => {
      try {
        for (const func of funcList) {
          await func.validate(value);
        }
      } catch (error) {
        return context.createError({ message: (error as Error).message });
      }
      return true;
    });
  },
);

export default Yup;
