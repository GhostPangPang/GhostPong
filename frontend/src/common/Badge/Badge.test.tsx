import { render } from '@/test';
import { Badge } from './Badge';
import { Avatar } from '../Avatar';

describe('Badge', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Badge size="sm" status="online">
        <Avatar />
      </Badge>,
    );
    expect(baseElement).toBeTruthy();
  });
});
