import { render } from '@/test';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Avatar />);
    expect(baseElement).toBeTruthy();
  });
});
