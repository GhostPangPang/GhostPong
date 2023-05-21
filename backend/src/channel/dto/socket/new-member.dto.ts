import { NewMember } from '@/types/channel';

export class NewMemberDto implements NewMember {
  /**
   * @description 유저 ID
   * @example 1
   */
  userId: number;

  /**
   * @description 유저 닉네임
   * @example 'hannkim'
   */
  nickname: string;

  /**
   * @description 유저 이미지 url
   * @example '/asset/profile-1.jpg'
   */
  image?: string;
}
