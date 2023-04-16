import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateImageRequest {
  /**
   * image의 url
   * @example 'src/dfwf/dfwdgwgd13fw....'
   */
  @IsNotEmpty()
  @IsString()
  image: string;
}
