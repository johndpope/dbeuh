/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { validatePagination } from '../table-utils';

interface IPagination {
  page: number;
  size: number;
  totalContent: number;
}

export interface IDataResponse {
  data?: never[] | null;
  code: number | null | undefined;
  loading?: boolean;
  title?: string;
  message?: string;
  pagination?: IPagination;
}

export const dataDefault = {
  page: 1,
  size: 10,
};

export const responseDefault: IDataResponse = {
  code: null,
  loading: true,
};

export function usePostData(INITIAL_OPTIONS?: AxiosRequestConfig) {
  const [data, setData] = useState<IDataResponse>(responseDefault);
  const [options, setOptions] = useState<AxiosRequestConfig>({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async function postData(PARAMS: AxiosRequestConfig) {
    try {
      const res = await axios(PARAMS);
      setData(res.data);
      setData(d => ({
        ...d,
        ...res.data,
        loading: false,
        data: validatePagination(res.data),
      }));
    } catch (error) {
      // https://github.com/axios/axios/issues/3612#issuecomment-1046542497
      const errors = error as AxiosError;
      if (!axios.isAxiosError(error)) {
        // do whatever you want with native error
      }
      setData({
        code: errors?.response?.status,
        message: errors?.response?.statusText,
        title: 'ERROR',
        loading: false,
      });
    }
  }

  function post(OPTIONS: AxiosRequestConfig): void {
    setOptions(opt => ({
      ...opt,
      ...OPTIONS,
    }));
  }

  useEffect(() => {
    const initToken = localStorage.getItem('token') || '';
    setOptions(opt => ({
      ...opt,
      ...INITIAL_OPTIONS,
      baseURL: INITIAL_OPTIONS?.baseURL || process.env['NEXT_PUBLIC_URL'],
      headers: {
        ...opt.headers,
        Authorization: `Bearer ${initToken}`,
      },
    }));
  }, []);

  useEffect(() => {
    if (options.url && options.url !== '') {
      setData(d => ({ ...d, ...responseDefault }));
      postData(options);
    }
  }, [options]);

  return [data, post] as const;
}
