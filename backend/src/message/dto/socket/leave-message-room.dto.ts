export class LeaveMessageRoomDto {
  /**
   * @description 친구 관계 아이디
   * @example 1
   */
  friendId: number;

  /**
   * @description 마지막으로 읽은 메세지의 sendingTime
   * @example 2020-12-12T12:12:12
   */
  lastViewTime: Date | string;
}
