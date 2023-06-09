import { SuccessResponse } from '@/types/common/response';

export class SuccessResponseDto implements SuccessResponse {
  /**
   * 성공 응답 메세지
   * @example '요청이 처리되었습니다.'
   */
  message: string;
}
