export class NicknameSuccessResponseDto {
  constructor(msg: string) {
    this.nickname = msg;
  }

  nickname: string;
}
