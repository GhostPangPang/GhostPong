export const validatePassword = (password: string): { isValid: boolean; errorMessage: string } => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d-]{4,20}$/;
  const isValid = regex.test(password);
  const errorMessage = isValid ? '' : '비밀번호는 4자 이상 20자 이하로 입력해주세요.(숫자와 영어 대소문자 가능)';
  return { isValid, errorMessage };
};

export const validateTitle = (title: string): { isValid: boolean; errorMessage: string } => {
  const regex = /^[\x20-\x7E가-힣]{3,19}$/;
  const isValid = regex.test(title);
  const errorMessage = isValid ? '' : '방 제목은 3자 이상 19자 이하로 입력해주세요.';
  return { isValid, errorMessage };
};
