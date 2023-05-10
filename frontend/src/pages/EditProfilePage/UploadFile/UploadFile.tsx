import { CommonButton } from '@/common/Button/CommonButton';

interface UploadFileProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadFile = ({ handleFileChange }: UploadFileProps) => {
  return (
    <div>
      <CommonButton as="label" htmlFor="file-upload" size="md" backgroundColor="gray200" color="gray100">
        Upload
      </CommonButton>
      <input id="file-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
    </div>
  );
};
