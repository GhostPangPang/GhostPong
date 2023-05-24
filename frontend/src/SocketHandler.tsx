import { useEffect, useState } from 'react';
import { connectSocket, disconnectSocket, emitEvent, offEvent, onEvent } from '@/libs/api';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { newMessageIdListState, newMessagesState, channelDataState, ChannelData } from './stores';
import { socketState } from './stores/socketState';
import { Message } from '@/dto/message/socket';
import { MemberInfo, UserId, NewChat } from '@/dto/channel/socket';
import { MessageEvent, ChannelEvent } from './constants';
import { useUserInfo } from './hooks/user';
import { useNavigate } from 'react-router-dom';

export const SocketHandler = () => {
  const socket = useRecoilValue(socketState);
  const { userInfo } = useUserInfo();
  const newMessages = useRecoilValue(newMessagesState);
  const navigate = useNavigate();

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

  const updateChatEvent = useRecoilCallback(({ set }) => (data: NewChat) => {
    console.log('socket chat', data);
    set(channelDataState, (prev) => ({
      ...prev,
      chats: [...prev.chats, data],
    }));
  });

  const updateJoinEvent = useRecoilCallback(({ set }) => (data: MemberInfo) => {
    console.log('socket join', data);
    set(channelDataState, (prev) => ({
      ...prev,
      observers: [...prev.observers, data],
    }));
  });

  const updateLeaveEvent = useRecoilCallback(({ set }) => (data: UserId) => {
    console.log('socket leave', data);
    set(channelDataState, (prev) => ({
      ...prev,
      observers: prev.observers.filter((observer) => observer.userId !== data.userId),
      leftPlayer: prev.leftPlayer?.userId === data.userId ? null : prev.leftPlayer,
      rightPlayer: prev.rightPlayer?.userId === data.userId ? null : prev.rightPlayer,
    }));
  });

  const updatePlayerEvent = useRecoilCallback(({ set }) => (data: UserId) => {
    console.log('socket player', data);
    set(channelDataState, (prev: ChannelData) => {
      const { nickname, image, role } = prev.observers.find((observer) => observer.userId === data.userId) || {
        nickname: '',
        image: '',
        role: 'member',
      };

      return {
        ...prev,
        observers: prev.observers.filter((observer) => observer.userId !== data.userId),
        rightPlayer: { userId: data.userId, nickname, image, role },
      };
    });
  });

  const updateAdminEvent = useRecoilCallback(({ set }) => (data: UserId) => {
    console.log('socket admin', data);

    set(channelDataState, (prev) => {
      const updatedState: ChannelData = { ...prev };

      if (updatedState.rightPlayer?.userId === data.userId) {
        updatedState.rightPlayer = { ...updatedState.rightPlayer, role: 'admin' };
      } else {
        updatedState.observers = updatedState.observers.map((observer) =>
          observer.userId === data.userId ? { ...observer, role: 'admin' } : observer,
        );
      }

      return updatedState;
    });
    if (userInfo.id === data.userId) alert(`${userInfo.nickname}님이 관리자가 되었습니다.`);
  });

  const updateOwnerEvent = useRecoilCallback(({ set }) => (data: UserId) => {
    console.log('socket owner', data);
    set(channelDataState, (prev: ChannelData) => {
      // user가 observer / rightPlayer
      const user =
        prev.observers.find((observer) => observer.userId === data.userId) ||
        (prev.rightPlayer?.userId === data.userId ? prev.rightPlayer : undefined);
      const isRightPlayer = user === prev.rightPlayer;

      return {
        ...prev,
        observers: prev.observers.filter((observer) => observer.userId !== data.userId),
        leftPlayer: user
          ? ({ userId: data.userId, nickname: user.nickname, image: user.image, role: 'owner' } as MemberInfo)
          : null,
        rightPlayer: isRightPlayer ? null : prev.rightPlayer,
      };
    });
  });

  const updateKickEvent = useRecoilCallback(({ set }) => (data: UserId) => {
    console.log('socket kick', data);
    set(channelDataState, (prev) => ({
      ...prev,
      observers: prev.observers.filter((observer) => observer.userId !== data.userId),
      leftPlayer: prev.leftPlayer?.userId === data.userId ? null : prev.leftPlayer,
      rightPlayer: prev.rightPlayer?.userId === data.userId ? null : prev.rightPlayer,
    }));
    if (userInfo.id === data.userId) {
      navigate('/channel/list');
      alert('강퇴되었습니다.');
    }
  });

  const updateBanEvent = useRecoilCallback(({ set }) => (data: UserId) => {
    console.log('socket ban', data);
    set(channelDataState, (prev) => ({
      ...prev,
      observers: prev.observers.filter((observer) => observer.userId !== data.userId),
      leftPlayer: prev.leftPlayer?.userId === data.userId ? null : prev.leftPlayer,
      rightPlayer: prev.rightPlayer?.userId === data.userId ? null : prev.rightPlayer,
    }));
    if (userInfo.id === data.userId) {
      navigate('/channel/list');
      alert('차단당했습니다.');
    }
  });

  // Init socket
  useEffect(() => {
    connectSocket();
    console.log('socket connect');

    onEvent('exception', (error) => {
      console.log('WebSocket Error', error);
    });

    return () => {
      disconnectSocket();
      console.log('socket disconnect');
    };
  }, []);

  // Turn on message socket event
  useEffect(() => {
    if (!socket.message) return;
    // onEvent(MessageEvent.MESSAGE, updateMessageEvent);
    onEvent(MessageEvent.MESSAGE, (data: Message) => {
      console.log('socket message fuckfuck', data);
      updateMessageEvent(data);
    });
    return () => {
      offEvent(MessageEvent.MESSAGE);
      console.log('socket message closed');
    };
  }, [socket]);

  // Turn on channel socket event
  useEffect(() => {
    if (!socket.channel) return;
    onEvent(ChannelEvent.CHAT, updateChatEvent);
    onEvent(ChannelEvent.JOIN, updateJoinEvent);
    onEvent(ChannelEvent.LEAVE, updateLeaveEvent);
    onEvent(ChannelEvent.KICK, updateKickEvent);
    onEvent(ChannelEvent.BAN, updateBanEvent);
    // onEvent(ChannelEvent.MUTE, updateMuteEvent);
    onEvent(ChannelEvent.PLAYER, updatePlayerEvent);
    onEvent(ChannelEvent.ADMIN, updateAdminEvent);
    onEvent(ChannelEvent.OWNER, updateOwnerEvent);
    return () => {
      offEvent(ChannelEvent.CHAT);
      offEvent(ChannelEvent.JOIN);
      offEvent(ChannelEvent.LEAVE);
      // offEvent(ChannelEvent.KICK);
      // offEvent(ChannelEvent.BAN);
      // offEvent(ChannelEvent.MUTE);
      offEvent(ChannelEvent.PLAYER);
      offEvent(ChannelEvent.ADMIN);
      offEvent(ChannelEvent.OWNER);
    };
    // register channel socket on event
  }, [socket]);

  // Turn on game socket event
  // useEffect(() => {
  //   if (!socket.game) return;
  //   console.log('socket game connect');
  //   // game-start(게임 시작 준비하세요 알리기) 이벤트 -> channel state 바꿔주기 [gamePlaying: true]

  //   // register game socket on event
  //   return () => {
  //     console.log('socket game disconnect');
  //   };
  // }, [socket]);

  useEffect(() => {
    if (newMessages.friend === null) return;
    console.log('socket message lastView', newMessages);
    emitEvent(MessageEvent.LASTVIEW, { friendId: newMessages.friend.id, lastViewTime: new Date().toISOString() });
  }, [newMessages.friend]);

  return <></>;
};
