export interface UpdateChannelRequest {
  mode: 'public' | 'protected' | 'private';
  password?: string;
}
