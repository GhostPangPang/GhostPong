import { registerDecorator, ValidationOptions, ValidationArguments, isAlphanumeric } from 'class-validator';

import { ChannelPassword } from '../../type/channel-mode.type';

/**
 * mode 가 protected 일 때 password 가 있는 지 검증하는 validation decorator
 *s
 * @param validationOptions validation options
 * @returns validation decorator
 */
export const IsChannelPassword = (validationOptions?: ValidationOptions) => {
  return (object: ChannelPassword, propertyName: string) => {
    registerDecorator({
      name: 'isPasswordRequired',
      target: object.constructor, // target object to be validated
      propertyName: propertyName, // target object's property name to be validated
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments): boolean {
          const mode = (args.object as ChannelPassword)['mode'];
          if (mode !== 'protected') {
            return value === undefined; // 있으면 error
          }
          return isAlphanumeric(value, 'en-US') && value.length >= 4 && value.length <= 20;
        },
        defaultMessage(args: ValidationArguments): string {
          const mode = (args.object as ChannelPassword)['mode'];
          if (mode === 'protected') {
            return '비밀번호 형식이 잘못되었습니다.';
          }
          return '비밀번호가 필요하지 않습니다.';
        },
      },
    });
  };
};
