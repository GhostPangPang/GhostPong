import { IconButton } from './IconButton';
import { ReactComponent as SendSvg } from '@/svgs/send.svg';
import { ReactComponent as CloseSvg } from '@/svgs/close.svg';

const meta = {
  title: 'Common/Button/IconButton',
  component: IconButton,
  argTypes: {},
  parameters: {},
  decorators: [],
};

export default meta;

export const Examples = () => {
  return (
    <>
      <IconButton>
        <SendSvg width="1.2rem" height="1.2rem" stroke="#D4D4D4" style={{ flexGrow: 0 }} />
      </IconButton>
      <IconButton>
        <CloseSvg />
      </IconButton>
    </>
  );
};
