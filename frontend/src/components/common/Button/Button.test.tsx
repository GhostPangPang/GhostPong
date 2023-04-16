import { describe, test, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test';
import { Button } from './Button';

describe('Button', () => {
  test('should render successfully', () => {
    render(
      <>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </>,
    );
    screen.debug();
    expect(screen.getByText('Small')).toBeTruthy();
    expect(screen.getByText('Medium')).toBeTruthy();
    expect(screen.getByText('Large')).toBeTruthy();
  });
  test('should render with color props', () => {
    render(
      <>
        <Button size="sm" color="primary">
          Primary
        </Button>
        <Button size="md" color="secondary">
          Secondary
        </Button>
      </>,
    );
    expect(screen.getByText('Primary')).toBeTruthy();
    expect(screen.getByText('Secondary')).toBeTruthy();
  });
  test('should render with as props', () => {
    render(
      <>
        <Button size="sm" as="a" href="https://naver.com">
          Naver
        </Button>
        <Button size="md" as="a" href="https://google.com">
          Google
        </Button>
      </>,
    );
    expect(screen.getByText('Naver')).toBeTruthy();
    expect(screen.getByText('Google')).toBeTruthy();
  });
  test('should render with onClick interaction', async () => {
    const onClick = vi.fn(() => 0);
    render(
      <>
        <Button size="sm" onClick={onClick}>
          Click
        </Button>
      </>,
    );
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
