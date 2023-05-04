import { Avatar } from '@/common/Avatar';
import { ReactComponent as More } from '@/svgs/more.svg';
import newSvg from '@/svgs/circle-sm.svg';
import { Box } from '@/common/Box';
import { Grid } from '@/layout/Grid';
import styled from 'styled-components';
import { Text } from '@/common/Text';

interface MessageListItemProps {
  image: string;
  nickname: string;
  lastMessegeTime: string | null;
  isDark: boolean;
}

const StyledMessageItemWrapper = styled.li<{ isDark?: MessageListItemProps['isDark'] }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 2rem 0;

  ${(props) => props.isDark && `background-color: ${props.theme.color.surfaceDark};`}
`;

const formatRelativeDate = (date: string | null) => {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const hour = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
    const minute = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    return `${hour}:${minute} ${ampm}`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays}days ago`;
  } else {
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  }
};

const MessageListItem = ({ image, nickname, lastMessegeTime, isDark }: MessageListItemProps) => {
  return (
    <StyledMessageItemWrapper isDark={isDark}>
      <Grid container="flex" alignItems="center">
        <Grid container="flex" direction="column" alignItems="center" size={{ width: '3rem' }}>
          <img src={newSvg} alt="new" />
        </Grid>
        <Grid container="flex" alignItems="center" gap={1}>
          <Avatar size="md" src={image} />
          <Grid container="flex" direction="column" gap={0.5}>
            <Text size="xs" weight="light" color="gray100">
              {nickname}
            </Text>
            <Text size="xxs" weight="light" color="gray100">
              Online
            </Text>
          </Grid>
        </Grid>
      </Grid>
      <Grid container="flex" justifyContent="end" alignItems="center" gap={1.5}>
        <Text size="xxs" weight="light" color="gray100">
          {formatRelativeDate(lastMessegeTime)}
        </Text>
        <More />
      </Grid>
    </StyledMessageItemWrapper>
  );
};

const MessageList = () => {
  const data = [
    {
      id: 37,
      user: {
        id: 486,
        nickname: 'crewmate',
        exp: 189,
        image: 'https://loremflickr.com/640/480',
      },
      lastMessegeTime: '2023-03-04T07:15:36.434Z',
      lastViewTime: null,
    },
    {
      id: 34,
      user: {
        id: 450,
        nickname: 'exhibit',
        exp: 146,
        image: 'https://loremflickr.com/640/480',
      },
      lastMessegeTime: '2023-01-25T18:02:54.295Z',
      lastViewTime: null,
    },
    {
      id: 33,
      user: {
        id: 445,
        nickname: 'watcher',
        exp: 5,
        image: 'https://loremflickr.com/640/480',
      },
      lastMessegeTime: '2022-09-21T17:47:44.103Z',
      lastViewTime: null,
    },
    {
      id: 8,
      user: {
        id: 122,
        nickname: 'squirrel',
        exp: 194,
        image: 'https://loremflickr.com/640/480',
      },
      lastMessegeTime: null,
      lastViewTime: null,
    },
  ];

  return (
    <Box>
      <Grid as="ul" container="flex" direction="column">
        {data.map((item, i) => (
          <MessageListItem key={item.id} isDark={i % 2 != 0} {...item.user} lastMessegeTime={item.lastMessegeTime} />
        ))}
      </Grid>
    </Box>
  );
};

const MessageInput = () => {
  return <Box height="3rem" />;
};

// const MessageContent = () => {};

const Message = () => {
  return (
    <Box>
      <Grid container="flex" direction="column" justifyContent="end" size={{ height: '100%', padding: 'sm' }}>
        <MessageInput />
      </Grid>
    </Box>
  );
};

export const MessagePage = () => {
  return (
    <Grid container="flex" justifyContent="center" alignContent="center" gap={1} size={{ maxWidth: '120rem' }}>
      <Grid xs={1} size={{ overflowY: 'auto' }}>
        <MessageList />
      </Grid>
      <Grid xs={2} size={{ overflowY: 'auto' }}>
        <Message />
      </Grid>
    </Grid>
  );
};
