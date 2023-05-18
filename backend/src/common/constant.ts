/**
 * @description: 상수 저장 파일
 */

import { CookieOptions } from 'express';

const FRIEND_LIMIT = 42;
const BLOCKED_USER_LIMIT = 42;
const PARTICIPANT_LIMIT = 10;
const DEFAULT_IMAGE = 'images/default_image.png';
const MESSAGE_SIZE_PER_PAGE = 32;
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const HISTORY_SIZE_PER_PAGE = 10;
const AUTH_JWT_EXPIRES_IN = '15m';
const USER_JWT_EXPIRES_IN = '4d';
const TWO_FA_JWT_EXPIRES_IN = '15m';
const TWO_FA_EXPIRES_IN = 1000 * 60 * 5; // 5m
const TWO_FA_MAX = 1000;
const COOKIE_EXPIRES_IN = 1000 * 60 * 15; // 15m

const COOKIE_OPTIONS: CookieOptions = {
  maxAge: COOKIE_EXPIRES_IN,
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
};

export {
  FRIEND_LIMIT,
  BLOCKED_USER_LIMIT,
  PARTICIPANT_LIMIT,
  DEFAULT_IMAGE,
  MESSAGE_SIZE_PER_PAGE,
  MAX_IMAGE_SIZE,
  HISTORY_SIZE_PER_PAGE,
  AUTH_JWT_EXPIRES_IN,
  USER_JWT_EXPIRES_IN,
  TWO_FA_JWT_EXPIRES_IN,
  TWO_FA_EXPIRES_IN,
  TWO_FA_MAX,
  COOKIE_OPTIONS,
};
