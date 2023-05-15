import { useMutation } from '@tanstack/react-query';
import { post, ApiResponse, ApiError } from '@/libs/api';
import { CodeVerificationRequest } from '@/dto/auth/request';
import { ChangeEvent, useState } from 'react';

const API = '/auth/2fa/verify';

const post2FAVerify = async (code: CodeVerificationRequest) => {
  return await post<ApiResponse>(API, code);
};

interface Props {
  onSuccess: () => void;
}

export const use2FAVerifyMutation = ({ onSuccess: refetch }: Props) => {
  const [code, setCode] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };
  const mutation = useMutation(
    () => {
      return post2FAVerify({ code: code });
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
