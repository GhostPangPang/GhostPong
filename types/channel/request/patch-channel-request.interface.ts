export interface PatchChannelRequest {
  mode: 'public' | 'protected' | 'private';
  password?: string;
}
