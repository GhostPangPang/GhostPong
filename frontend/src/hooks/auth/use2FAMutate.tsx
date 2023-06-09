import { useMutation } from '@tanstack/react-query';
import { post, del, ApiResponse, ApiError } from '@/libs/api';
import { TwoFactorAuthRequest } from '@/dto/auth/request';

const API = '/auth/2fa';

const post2FA = async (email: TwoFactorAuthRequest) => {
  return await post<ApiResponse>(API, email);
};

const delete2FA = async () => {
  return await del<ApiResponse>(API);
};

interface Props {
  onSuccess: () => void;
}

export const use2FADeleteMutation = ({ onSuccess: refetch }: Props) => {
  const mutation = useMutation(
    () => {
      return delete2FA();
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

  return { handleSubmit };
};

interface TwoFAProps {
  twoFAEmail: string;
}

export const use2FAMutation = ({ twoFAEmail }: TwoFAProps) => {
  const { mutate } = useMutation(
    () => {
      return post2FA({ email: twoFAEmail });
    },
    {
      onSuccess: (data: ApiResponse) => {
        alert(data.message + ' 5분 안에 메일을 확인해주세요.');
      },
      onError: (error: ApiError) => {
        alert(error.message);
        throw new Error(error.message);
      },
    },
  );

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    mutate();
  };

  return { handleSubmit };
};
