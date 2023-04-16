export class NicknameResponseDto {
  constructor(nickname: string) {
    this.nickname = nickname;
  }

  /**
   * 변경된 nickname
   */
  nickname: string;
}
