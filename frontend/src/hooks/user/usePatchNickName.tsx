import { patch, ApiResponse, ApiError } from '@/libs/api';
import { useMutation } from '@tanstack/react-query';

const API = '/user/nickname';

interface Props {
  nickName: string;
  onSuccess: () => void;
}

const patchNickName = async (nickname: string) => {
  return await patch<ApiResponse>(API, { nickname });
};

export const usePatchNickName = ({ nickName, onSuccess: refetch }: Props) => {
  const { mutate } = useMutation(
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
    mutate();
  };

  return { handleSubmit };
};
