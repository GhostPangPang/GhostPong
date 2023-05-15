import { patch, ApiResponse, ApiError } from '@/libs/api';
import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';

const API = '/user/nickname';

const patchNickName = async (nickname: string) => {
  return await patch<ApiResponse>(API, { nickname });
};

interface Props {
  onSuccess: () => void;
}

export const usePatchNickName = ({ onSuccess: refetch }: Props) => {
  const [nickName, setNickName] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNickName(event.target.value);
  };

  const mutation = useMutation(
    () => {
      if (!nickName) throw new Error('No nickname selected');
      return patchNickName(nickName);
    },
    {
      onSuccess: (data: ApiResponse) => {
        alert(data.message);
        refetch();
      },
      onError: (error: ApiError) => {
        alert(error.message);
        throw new Error(error.message);
      },
    },
  );

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    mutation.mutate();
  };

  return { handleInputChange, handleSubmit };
};
