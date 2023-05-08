import { Grid } from '@/layout/Grid';
import { MessageList } from './MessageList';
import { Message } from './Message';

export const MessagePage = () => {
  const friends = [
    {
      id: 37,
      user: {
        id: 486,
        nickname: 'crewmate',
        exp: 189,
        image: 'https://loremflickr.com/640/480',
      },
      lastMessageTime: '2023-03-04T07:15:36.434Z',
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
      lastMessageTime: '2023-01-25T18:02:54.295Z',
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
      lastMessageTime: '2022-09-21T17:47:44.103Z',
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
      lastMessageTime: null,
      lastViewTime: null,
    },
  ];
  const messages = [
    {
      id: 2059,
      senderId: 486,
      content: 'Cupiditate facilis sed ad adipisci.',
      createdAt: '2023-02-27T05:39:23.791Z',
    },
    {
      id: 2068,
      senderId: 1,
      content: 'Nobis rem sed voluptas dolore.',
      createdAt: '2023-02-18T10:36:50.553Z',
    },
    {
      id: 2082,
      senderId: 1,
      content: 'Praesentium sequi praesentium necessitatibus mollitia.',
      createdAt: '2023-02-16T20:48:23.610Z',
    },
    {
      id: 2046,
      senderId: 1,
      content: 'Neque doloremque neque sapiente est culpa cumque commodi porro eaque.',
      createdAt: '2023-01-23T19:46:30.569Z',
    },
    {
      id: 2063,
      senderId: 1,
      content: 'Fugit quisquam soluta velit commodi quibusdam numquam nihil.',
      createdAt: '2023-01-10T09:45:50.894Z',
    },
    {
      id: 2042,
      senderId: 486,
      content: 'Ducimus ullam dolorem quidem reiciendis dicta nobis eius.',
      createdAt: '2022-11-24T22:45:04.781Z',
    },
    {
      id: 2057,
      senderId: 1,
      content: 'Culpa ipsum nam omnis enim nemo sapiente officiis.',
      createdAt: '2022-08-05T14:46:42.021Z',
    },
    {
      id: 2079,
      senderId: 486,
      content: 'Neque suscipit tenetur non.',
      createdAt: '2022-07-25T19:02:35.718Z',
    },
    {
      id: 2081,
      senderId: 486,
      content: 'Expedita placeat impedit error dignissimos explicabo totam quisquam.',
      createdAt: '2022-07-23T19:39:31.751Z',
    },
    {
      id: 2065,
      senderId: 1,
      content: 'Molestiae nostrum quis veniam.',
      createdAt: '2022-07-08T18:37:01.008Z',
    },
    {
      id: 2080,
      senderId: 1,
      content: 'Incidunt praesentium ratione ex.',
      createdAt: '2022-06-24T07:45:46.256Z',
    },
    {
      id: 2048,
      senderId: 486,
      content: 'Magni dolore eligendi quis.',
      createdAt: '2022-04-26T17:45:39.513Z',
    },
    {
      id: 2053,
      senderId: 1,
      content: 'Minus excepturi quibusdam vero officiis non incidunt pariatur.',
      createdAt: '2022-04-16T06:56:13.825Z',
    },
    {
      id: 2061,
      senderId: 1,
      content: 'Eos culpa laudantium doloremque.',
      createdAt: '2022-03-25T06:53:34.325Z',
    },
    {
      id: 2040,
      senderId: 486,
      content: 'Nemo odit necessitatibus consectetur rerum dolor doloremque voluptatibus esse ipsum.',
      createdAt: '2022-03-15T13:27:37.566Z',
    },
  ];
  return (
    <Grid
      container="flex"
      justifyContent="center"
      alignContent="center"
      alignSelf="center"
      gap={1}
      size={{ height: '100%', maxWidth: '120rem', minHeight: '0' }}
    >
      <Grid xs={1} size={{ overflowY: 'auto' }}>
        <MessageList friends={friends} />
      </Grid>
      <Grid container="flex" direction="column" xs={2}>
        <Message messages={messages} />
      </Grid>
    </Grid>
  );
};
