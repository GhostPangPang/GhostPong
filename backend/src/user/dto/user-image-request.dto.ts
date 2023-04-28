import { UserImageRequest } from '@/types/user/request';

import { IsNotEmpty, IsString } from 'class-validator';

export class UserImageRequestDto implements UserImageRequest {
  /**
   * image의 url
   * @example '/asset/profile-1.jpg'
   */
  @IsNotEmpty()
  @IsString()
  image: string;
}
