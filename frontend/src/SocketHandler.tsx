import { useEffect } from 'react';
import { connectSocket, disconnectSocket, emitEvent, offEvent, onEvent } from '@/libs/api';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { newMessageIdListState, newMessagesState, newChannelDataState } from './stores';
import { socketState } from './stores/socketState';
import { Message } from '@/dto/message/socket';
import { MemberInfo, UserId } from '@/dto/channel/socket';
import { MessageEvent, ChannelEvent } from './constants';

export const SocketHandler = () => {
  const socket = useRecoilValue(socketState);
  const newMessages = useRecoilValue(newMessagesState);
  const updateMessageEvent = useRecoilCallback(({ snapshot, set }) => (data: Message) => {
    console.log('socket message', data);
    const current = snapshot.getLoadable(newMessagesState).getValue().friend;
    if (!current) return;
    if (current.id === data.id) {
      console.log('current mesage update', data);

      set(newMessagesState, (prev) => ({
        ...prev,
        messages: [...prev.messages, data],
      }));
    } else {
      console.log('change message id list', data.id, 'prevId', current.id, 'newMessages', newMessages);

      set(newMessageIdListState, (prev) => [...prev, data.id]);
    }
  });

  // const updateChatEvent = useRecoilCallback(({ set }) => (data: Chat) => {
  //   console.log('socket chat', data);
  //   set(newChannelDataState, (prev) => ({
  //     ...prev,
  //     chat: [...prev.chats, data],
  //   }));
  // });

  const updateJoinEvent = useRecoilCallback(({ set }) => (data: MemberInfo) => {
    console.log('socket join', data);
    set(newChannelDataState, (prev) => ({
      ...prev,
      observers: [...prev.observers, data],
    }));
  });

  const updateLeaveEvent = useRecoilCallback(({ set }) => (data: UserId) => {
    console.log('socket leave', data);
    set(newChannelDataState, (prev) => ({
      ...prev,
      observers: prev.observers.filter((observer) => observer.userId !== data.userId),
      leftPlayer: prev.leftPlayer?.userId === data.userId ? null : prev.leftPlayer,
      rightPlayer: prev.rightPlayer?.userId === data.userId ? null : prev.rightPlayer,
    }));
  });

  // Init socket
  useEffect(() => {
    connectSocket();

    onEvent('exception', (error) => {
      console.log('WebSocket Error', error);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  // Turn on message socket event
  useEffect(() => {
    if (!socket.message) return;
    onEvent(MessageEvent.MESSAGE, updateMessageEvent);
    return () => {
      offEvent(MessageEvent.MESSAGE);
    };
  }, [socket]);

  // Turn on channel socket event
  useEffect(() => {
    if (!socket.channel) return;
    // onEvent(ChannelEvent.CHAT, updateChatEvent);
    onEvent(ChannelEvent.JOIN, updateJoinEvent);
    onEvent(ChannelEvent.LEAVE, updateLeaveEvent);
    // onEvent(ChannelEvent.KICK, updateKickEvent);
    // onEvent(ChannelEvent.BAN, updateBanEvent);
    // onEvent(ChannelEvent.MUTE, updateMuteEvent);
    // onEvent(ChannelEvent.PLAYER, updatePlayerEvent);
    // onEvent(ChannelEvent.ADMIN, updateAdminEvent);
    // onEvent(ChannelEvent.OWNER, updateOwnerEvent);
    return () => {
      // offEvent(ChannelEvent.CHAT);
      offEvent(ChannelEvent.JOIN);
      offEvent(ChannelEvent.LEAVE);
      // offEvent(ChannelEvent.KICK);
      // offEvent(ChannelEvent.BAN);
      // offEvent(ChannelEvent.MUTE);
      // offEvent(ChannelEvent.PLAYER);
      // offEvent(ChannelEvent.ADMIN);
      // offEvent(ChannelEvent.OWNER);
    };
    // register channel socket on event
  }, [socket]);

  // Turn on game socket event
  useEffect(() => {
    if (!socket.game) return;
    // game-start(게임 시작 준비하세요 알리기) 이벤트 -> channel state 바꿔주기 [gamePlaying: true]

    // register game socket on event
  }, [socket]);

  useEffect(() => {
    if (newMessages.friend === null) return;
    console.log('socket message lastView', newMessages);
    emitEvent(MessageEvent.LASTVIEW, { friendId: newMessages.friend.id, lastViewTime: new Date().toISOString() });
  }, [newMessages.friend]);

  return <></>;
};
