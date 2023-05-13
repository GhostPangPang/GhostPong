import { post, patch } from '@/libs/api';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { ChangeEvent, useState } from 'react';

const API = '/user/image';

const postFileUpload = async (formData: FormData): Promise<AxiosResponse> => {
  return await post<AxiosResponse>(API, formData);
};

const patchFileUpload = async (location: string): Promise<AxiosResponse> => {
  return await patch<AxiosResponse>(API, { image: location });
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
    (location: string) => {
      if (!location) return Promise.reject(new Error('No location selected'));
      return patchFileUpload(location);
    },
    {
      onSuccess: (data) => {
        alert('프로필 사진이 변경되었습니다.');
        console.log(data);
        refetch();
      },
      onError: (error) => {
        alert('프로필 사진 변경에 실패하였습니다.');
        console.log(error);
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
      onSuccess: (data) => {
        patchMutate(data.headers.location);
      },
      onError: (error) => {
        alert('파일 업로드에 실패하였습니다.');
        console.log(error);
        // return Promise.reject(new Error('File Upload Failure'));
      },
    },
  );

  return { selectedFile, handleFileChange, handleUpload };
};
