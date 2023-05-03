import { BadRequestException } from '@nestjs/common';
import { NonNegativeIntPipe } from './non-negative-int.pipe';

describe('NonNegativeIntegerPipe', () => {
  it('should be defined', () => {
    expect(new NonNegativeIntPipe()).toBeDefined();
  });
  type Paramtype = 'body' | 'query' | 'param' | 'custom';
  const type: Paramtype = 'param';
  const metadata = { type };

  // NOTE: Success case
  it('음이 아닌 정수 형식의 string 을 number 형태로 반환', () => {
    const pipe = new NonNegativeIntPipe();
    const randomInt = Math.floor(Math.random() * 2147483647);
    expect(pipe.transform(randomInt.toString(), metadata)).resolves.toBe(randomInt);
  });

  //NOTE: Failure case
  it('16진수를 넣으면 BadRequestException 이 발생', () => {
    const pipe = new NonNegativeIntPipe();
    expect(pipe.transform('0xff', metadata)).rejects.toThrowError(BadRequestException);
  });

  it('문자열을 넣으면 BadRequestException 이 발생', () => {
    const pipe = new NonNegativeIntPipe();
    expect(pipe.transform('abc', metadata)).rejects.toThrowError(BadRequestException);
  });

  it('음수를 넣으면 BadRequestException 이 발생', () => {
    const pipe = new NonNegativeIntPipe();
    expect(pipe.transform('-1', metadata)).rejects.toThrowError(BadRequestException);
  });

  it('integer max 를 넘는 숫자를 넣으면 BadRequestException 이 발생', () => {
    const pipe = new NonNegativeIntPipe();
    expect(pipe.transform('2147483648', metadata)).rejects.toThrowError(BadRequestException);
  });

  it('몹시 큰 숫자를 넣으면 BadRequestException 이 발생', () => {
    const pipe = new NonNegativeIntPipe();
    expect(pipe.transform('144115188075855872', metadata)).rejects.toThrowError(BadRequestException);
  });
});
