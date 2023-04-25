export class UserNicknameResponseDto {
  constructor(nickname: string) {
    this.nickname = nickname;
  }
  /**
   * nickname
   * @example 'san1'
   */
  nickname: string;
}
