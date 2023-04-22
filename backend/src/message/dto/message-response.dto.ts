class MessageInfo {
  /**
   * 메시지 아이디
   * @example 1
   */
  id: number;

  /**
   * 메시지 보낸 사람 아이디
   * @example 1
   */
  senderId: number;

  /**
   * 메세지 내용
   * @example '안녕하세요'
   */
  content: string;

  /**
   * 메세지 보낸 시간
   * @example '2021-08-01T00:00:00.000Z'
   */
  createdAt: Date;
}

export class MessageResponseDto {
  /**
   * 메시지 리스트 (32개)
   */
  messages: MessageInfo[];
}
