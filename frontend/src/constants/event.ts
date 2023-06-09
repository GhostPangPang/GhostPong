export const MessageEvent = {
  LASTVIEW: 'last-message-view',
  MESSAGE: 'message',
  FRIENDACCEPT: 'friend-accepted',
};

export const GLOBALEVENT = {
  USER_STATUS: 'user-status',
  INVITE_CHANNEL: 'channel-invited',
};

export const GameEvent = {
  PLAYERREADY: 'player-ready',
  GAMESTART: 'game-start',
  GAMEDATA: 'game-data',
  GAMEEND: 'game-end',
  BARMOVED: 'bar-moved',
  MOVEBAR: 'move-bar',
};
// JOIN: 채널 입장 이벤트
// LEAVE: 채널 퇴장 이벤트
// KICK: 채널에서 강퇴당한 이벤트
// BAN: 채널에서 차단당한 이벤트
// MUTE: 채널에서 음소거당한 이벤트
// PLAYER: 채널에서 플레이어로 설정된 이벤트
// ADMIN: 채널에서 관리자로 설정된 이벤트
// OWNER: 채널에서 방장으로 설정된 이벤트
// CHAT: 채널에서 채팅 이벤트
export const ChannelEvent = {
  JOIN: 'new-member',
  LEAVE: 'user-left-channel',
  KICK: 'kicked',
  BAN: 'banned',
  UPDATE: 'channel-updated',
  PLAYER: 'player',
  ADMIN: 'admin',
  OWNER: 'owner',
  CHAT: 'new-chat',
};
