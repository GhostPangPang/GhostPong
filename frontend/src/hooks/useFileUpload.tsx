import { post, patch, ApiResponse, ApiError, LocationResponse } from '@/libs/api';
import { useMutation } from '@tanstack/react-query';

import { ChangeEvent, useState } from 'react';

const API = '/user/image';

const postFileUpload = async (formData: FormData) => {
  return await post<LocationResponse>(API, formData);
};

const patchFileUpload = async (location: LocationResponse) => {
  return await patch<ApiResponse>(API, { image: location });
};

export const useFileUpload = () => {
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
      if (!location) throw new Error('No location selected');
      return patchFileUpload(location);
    },
    {
      onSuccess: (data: ApiResponse) => {
        alert(data.message);
        location.reload();
      },
      onError: (error: ApiError) => {
        alert(error.message);
        throw new Error(error.message);
      },
    },
  );

  const { mutate: postMutate } = useMutation(
    (selectedFile: File | undefined) => {
      if (!selectedFile) throw new Error('No file selected');

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
        throw new Error(error.message);
      },
    },
  );

  return { selectedFile, handleFileChange, handleUpload };
};
