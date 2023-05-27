import { useChannelMutation } from '@/hooks/channel';
import { useRecoilValue } from 'recoil';
import { channelIdState, ChannelData, currentRoleSelector } from '@/stores';
import { useUserInfo } from '@/hooks/user';
import { MemberInfo } from '@/dto/channel';

export interface Item {
  label: string;
  onClick: () => void;
}

export interface Items {
  leftPlayer: Item[];
  rightPlayer: Item[];
  observers: Item[][];
}

// 이걸 리코일에 넣을까
export const itemGenerator = (newChannelData: ChannelData): Items => {
  const { becomeAdmin, kick, ban, mute } = useChannelMutation();
  const currentRole = useRecoilValue(currentRoleSelector);
  const channelId = useRecoilValue(channelIdState);
  const { userInfo } = useUserInfo();

  const getCommonItems = (userId: number) =>
    userId === userInfo.id
      ? []
      : [
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          { label: '친구추가', onClick: () => {} },
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          { label: '차단', onClick: () => {} },
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          { label: '프로필', onClick: () => {} },
        ];

  const getAdminItems = (userId: number) =>
    userId === userInfo.id
      ? []
      : [
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          {
            label: 'KICK',
            onClick: () => {
              kick({
                channelId: channelId,
                userId: userId,
              });
            },
          },
          {
            label: 'MUTE',
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick: () => {
              mute({
                channelId: channelId,
                userId: userId,
              });
            },
          },
          {
            label: 'BAN',
            onClick: () => {
              ban({
                channelId: channelId,
                userId: userId,
              });
            },
          },
          ...getCommonItems(userId),
        ];

  const getOwnerItems = (userId: number) =>
    userId === userInfo.id
      ? []
      : [
          {
            label: '관리자 등록',
            onClick: () =>
              becomeAdmin({
                channelId: channelId,
                userId: userId,
              }),
          },
          ...getAdminItems(userId),
        ];

  const roleItems = {
    owner: getOwnerItems,
    admin: getAdminItems,
    member: getCommonItems,
  };

  const role = currentRole || 'member';

  const getItemsForRole = (user: MemberInfo | null) => (user ? roleItems[role](user.userId) : []);
  const getItemsForObservers = (users: MemberInfo[]) =>
    users ? users.map((user) => roleItems[role](user.userId)) : [];

  const leftPlayerItems = getItemsForRole(newChannelData.leftPlayer);
  const rightPlayerItems = getItemsForRole(newChannelData.rightPlayer);
  const observerItems = getItemsForObservers(newChannelData.observers);

  return {
    leftPlayer: leftPlayerItems,
    rightPlayer: rightPlayerItems,
    observers: observerItems,
  };
};

// export const itemGenerator = () => {
//   const { becomeAdmin } = useChannelMutation();
//   const channelDataLoadable = useRecoilValueLoadable(channelDataState);
//   const channelId = useRecoilValue(channelIdState);
//   const { userInfo } = useUserInfo();

//   const [items, setItems] = useState<
//     | {
//         leftPlayer: { label: string; onClick: () => void }[];
//         rightPlayer: { label: string; onClick: () => void }[];
//         observers: { label: string; onClick: () => void }[][];
//       }
//     | undefined
//   >();

//   useEffect(() => {
//     if (channelDataLoadable.state === 'hasValue') {
//       // Your logic here ...
//       console.log('useeffect ', channelDataLoadable.contents);
//       const newChannelData = channelDataLoadable.contents as ChannelData;
//       console.log('newChannelData', newChannelData.observers);
//       const getCommonItems = (userId: number) =>
//         userId === userInfo.id
//           ? []
//           : [
//               // eslint-disable-next-line @typescript-eslint/no-empty-function
//               { label: '친구추가', onClick: () => {} },
//               // eslint-disable-next-line @typescript-eslint/no-empty-function
//               { label: '차단', onClick: () => {} },
//               // eslint-disable-next-line @typescript-eslint/no-empty-function
//               { label: '프로필', onClick: () => {} },
//             ];

//       const getAdminItems = (userId: number) =>
//         userId === userInfo.id
//           ? []
//           : [
//               // eslint-disable-next-line @typescript-eslint/no-empty-function
//               { label: 'KICK', onClick: () => {} },
//               // eslint-disable-next-line @typescript-eslint/no-empty-function
//               { label: 'MUTE', onClick: () => {} },
//               // eslint-disable-next-line @typescript-eslint/no-empty-function
//               { label: 'BAN', onClick: () => {} },
//               ...getCommonItems(userId),
//             ];

//       const getOwnerItems = (userId: number) =>
//         userId === userInfo.id
//           ? []
//           : [
//               {
//                 label: '관리자 등록',
//                 onClick: () =>
//                   becomeAdmin({
//                     channelId: channelId,
//                     userId: userId,
//                   }),
//               },
//               ...getAdminItems(userId),
//             ];

//       const roleItems = {
//         owner: getOwnerItems,
//         admin: getAdminItems,
//         member: getCommonItems,
//       };

//       const role = currentRole || 'member';

//       const getItemsForRole = (user: MemberInfo | null) => (user ? roleItems[role](user.userId) : []);
//       const getItemsForObservers = (users: MemberInfo[]) =>
//         users ? users.map((user) => roleItems[role](user.userId)) : [];

//       const leftPlayerItems = getItemsForRole(newChannelData.leftPlayer);
//       const rightPlayerItems = getItemsForRole(newChannelData.rightPlayer);
//       const observerItems = getItemsForObservers(newChannelData.observers);

//       setItems({
//         leftPlayer: leftPlayerItems,
//         rightPlayer: rightPlayerItems,
//         observers: observerItems,
//       });
//     }
//   }, [channelDataLoadable.contents]);

//   return items;
// };
