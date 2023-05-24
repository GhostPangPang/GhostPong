import { NewChat } from '@/types/channel/socket';

export default class NewChatDto implements NewChat {
  /**
   * @description 채널 아이디
   * @example 'djd342djf'
   */
  channelId: string;

  /**
   * @description 수신자 아이디
   * @example 4
   */
  senderId: number;

  /**
   * @description 수신자 닉네임
   * @example 'san'
   */
  senderNickname: string;

  /**
   * @description 채팅 보낸 시간
   * @example '2021-08-01T00:00:00'
   */
  createdAt: Date | string;

  /**
   * @description 채팅 내용
   * @example '안녕하세요'
   */
  content: string;
}
