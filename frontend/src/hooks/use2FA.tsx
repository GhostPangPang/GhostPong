import { get } from '@/libs/api';
import { TwoFactorAuthResponse } from '@/dto/auth/response';
import { useQuery } from '@tanstack/react-query';

const API = '/auth/2fa';

const get2fa = async () => {
  return await get<TwoFactorAuthResponse>(API);
};

const initialData: TwoFactorAuthResponse = {
  twoFa: null,
};

export const use2FA = () => {
  const {
    data = initialData,

    refetch,
  } = useQuery<TwoFactorAuthResponse>({
    queryKey: [API],
    queryFn: get2fa,
    retryOnMount: true,
    staleTime: Infinity,
    onError: (error) => {
      throw error;
    },
  });

  return { data, refetch };
};
