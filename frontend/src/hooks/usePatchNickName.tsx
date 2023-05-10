import { patch } from '@/libs/api';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { ChangeEvent, useState } from 'react';

const API = '/user/nickname';

const patchNickName = async (nickname: string): Promise<AxiosResponse> => {
  return await patch<AxiosResponse>(API, { nickname });
};

export const usePatchNickName = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const mutation = useMutation(
    () => {
      if (!inputValue) return Promise.reject(new Error('No nickname selected'));

      return patchNickName(inputValue);
    },
    {
      onSuccess: (data) => {
        alert('닉네임이 설정되었습니다.');
        console.log(data);
      },
      onError: (error) => {
        alert('닉네임 설정에 실패하였습니다.');
        console.log(error);
      },
    },
  );

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    mutation.mutate();
  };

  return { handleInputChange, handleSubmit };
};
