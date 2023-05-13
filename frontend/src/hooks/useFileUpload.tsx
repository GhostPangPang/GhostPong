import { post, patch, ApiResponse, ApiError, LocationResponse } from '@/libs/api';
import { useMutation } from '@tanstack/react-query';

import { ChangeEvent, useState } from 'react';

const API = '/user/image';

const postFileUpload = async (formData: FormData): Promise<LocationResponse> => {
  return await post<LocationResponse>(API, formData);
};

const patchFileUpload = async (location: LocationResponse): Promise<ApiResponse> => {
  return await patch<ApiResponse>(API, { image: location });
};

interface Props {
  onSuccess: () => void;
}

export const useFileUpload = ({ onSuccess: refetch }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    postMutate(selectedFile);
  };

  const { mutate: patchMutate } = useMutation(
    (location: LocationResponse) => {
      if (!location) return Promise.reject(new Error('No location selected'));
      return patchFileUpload(location);
    },
    {
      onSuccess: (data: ApiResponse) => {
        alert(data.message);
        refetch();
      },
      onError: (error: ApiError) => {
        alert(error.message);
        return Promise.reject(new Error(error.message));
      },
    },
  );

  const { mutate: postMutate } = useMutation(
    (selectedFile: File | undefined) => {
      if (!selectedFile) return Promise.reject(new Error('No file selected'));

      const formData = new FormData();
      formData.append('image', selectedFile);
      return postFileUpload(formData);
    },
    {
      onSuccess: (data: LocationResponse) => {
        patchMutate(data);
      },
      onError: (error: ApiError) => {
        alert(error.message);
        return Promise.reject(new Error(error.message));
      },
    },
  );

  return { selectedFile, handleFileChange, handleUpload };
};
