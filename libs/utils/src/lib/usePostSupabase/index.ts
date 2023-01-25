/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { PaginationProps } from '@wsh4and/antd-v5';
import { IDataResponse, responseDefault, usePostData } from '../usePostData';
import { deHashPayload, deHashString, hashPayload } from '../hash-payload';

export interface ISupabase extends AxiosRequestConfig {
  data: {
    token?: string;
    schema?: string;
    table: string;
    select: string;
    page: number;
    size: number;
  };
}

function checkHashEnvironment(data: any) {
  if (process.env['NODE_ENV'] === 'production') {
    return hashPayload(data);
  }

  return data;
}

function checkDeHashEnvironment(data: any) {
  if (process.env['NODE_ENV'] === 'production') {
    return deHashPayload(data);
  }

  return data;
}

function checkDeHashString(data: any) {
  if (process.env['NODE_ENV'] === 'production') {
    return deHashString(data);
  }

  return data;
}

// @ts-ignore
export function usePostSupabase(INITIAL_OPTIONS?: ISupabase, token: string) {
  const [response, getTableData] = usePostData();
  const [data, setData] = useState<IDataResponse>(responseDefault);

  function resetDataResponse() {
    setData({
      code: null,
      data: null,
      loading: true,
    });
  }

  const pagination: PaginationProps = {
    total: 0,
    defaultCurrent: INITIAL_OPTIONS?.data.page,
    defaultPageSize: INITIAL_OPTIONS?.data.size,
    onChange: (page, pageSize) => {
      // console.log(page, pageSize);
      /**
       * Reset response here to fix bug where the response values do not changes as expected
       * causing component to render 5 times
       * code: null / 200,
       * data: null / previous data / current data (even though the code is null or the loading true),
       * loading: true / false
       * this way component only render 2 times; when code null and when code present
       */
      resetDataResponse();
      getTableData({
        ...INITIAL_OPTIONS,
        data: checkHashEnvironment({ ...INITIAL_OPTIONS?.data, page: page, size: pageSize }),
      });
    },
    onShowSizeChange: (current, size) => {
      // console.log(current, size);
      resetDataResponse();
      getTableData({
        ...INITIAL_OPTIONS,
        data: checkHashEnvironment({
          ...INITIAL_OPTIONS?.data,
          defaultCurrent: current,
          size: size,
        }),
      });
    },
  };

  function postData() {
    getTableData({
      ...INITIAL_OPTIONS,
      data: checkHashEnvironment({ ...INITIAL_OPTIONS?.data, token }),
    });
  }

  useEffect(() => {
    if (INITIAL_OPTIONS?.url && INITIAL_OPTIONS.url !== '' && token) {
      resetDataResponse();
      getTableData({
        ...INITIAL_OPTIONS,
        data: checkHashEnvironment({ ...INITIAL_OPTIONS, token }),
      });
    }
  }, [token, INITIAL_OPTIONS]);

  useEffect(() => {
    if (response.code === 200) {
      console.log('process.env.NODE_ENV', process.env['NODE_ENV']);
      setData(d => ({
        ...response,
        loading: false,
        data: checkDeHashEnvironment(response.data),
      }));
    }
    if (response.code === 500) {
      setData(d => ({
        ...response,
        message: checkDeHashString(response.message),
      }));
    }
  }, [response]);

  return {
    postData,
    response: data,
    pagination: { ...pagination, total: response?.pagination?.totalContent },
  };
}
