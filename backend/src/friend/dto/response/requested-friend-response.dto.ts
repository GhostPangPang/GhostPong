import { RequestedFriendsResponse } from '@/types/friend/response';

import { UserInfoDto } from '../../../user/dto/user-info.dto';

class Request {
  id: number;
  sender: UserInfoDto;
}
export class RequestedFriendsResponseDto implements RequestedFriendsResponse {
  /**
   * 친구 신청한 유저의 정보 배열
   */
  requests: Request[];
}
