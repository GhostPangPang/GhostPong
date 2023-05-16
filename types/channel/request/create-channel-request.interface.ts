export interface CreateChannelRequest {
  name: string;
  mode: 'public' | 'protected' | 'private';
  password?: string;
}
