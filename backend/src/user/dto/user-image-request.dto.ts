import { UserImageRequest } from '@/types/user/request/user-image-request.interface';

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
