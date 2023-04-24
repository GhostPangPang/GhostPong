import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateImageRequestDto {
  /**
   * image의 url
   * @example '/asset/profile-1.jpg'
   */
  @IsNotEmpty()
  @IsString()
  image: string;
}
