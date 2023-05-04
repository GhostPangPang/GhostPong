import { ArgumentMetadata, BadRequestException, Injectable, ParseIntPipe, PipeTransform } from '@nestjs/common';

/**
 * 2147483647 이하이면서 양수인 Integer 허용.
 */
@Injectable()
export class NonNegativeIntPipe extends ParseIntPipe implements PipeTransform {
  async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
    const val = await super.transform(value, metadata);
    if (val < 0 || val > 2147483647) {
      throw new BadRequestException('유효하지 않은 범위의 숫자입니다.');
    }
    return val;
  }
}
