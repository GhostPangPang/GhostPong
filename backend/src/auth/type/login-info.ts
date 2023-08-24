/**
 * type for oauth login profile information
 */

export type LoginInfo = {
  provider: 'ft' | 'google' | 'github';
  email: string | null;
  id: string;
};
