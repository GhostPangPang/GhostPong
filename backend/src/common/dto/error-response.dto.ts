export class ErrorResponseDto {
  /**
   * 에러 상태코드 (40x, 50x)
   * @example 400
   */
  statusCode: number;

  /**
   * 에러 상세 메세지
   * @example '요청이 처리되지 않았습니다.'
   */
  message: string;

  /**
   * 에러 코드 설명
   * @example 'Not Found'
   */
  error: string;
}
