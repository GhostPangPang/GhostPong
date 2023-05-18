export interface JoinChannelRequest {
	mode: 'public' | 'protected' | 'private';
	password?: string;
}
