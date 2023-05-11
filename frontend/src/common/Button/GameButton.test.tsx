import { describe, test, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test';
import { GameButton } from './GameButton';

describe('Button', () => {
  test('should render successfully', () => {
    render(
      <>
        <GameButton size="sm">Small</GameButton>
        <GameButton size="md">Medium</GameButton>
        <GameButton size="lg">Large</GameButton>
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
        <GameButton size="sm" color="primary">
          Primary
        </GameButton>
        <GameButton size="md" color="secondary">
          Secondary
        </GameButton>
      </>,
    );
    expect(screen.getByText('Primary')).toBeTruthy();
    expect(screen.getByText('Secondary')).toBeTruthy();
  });
  test('should render with as props', () => {
    render(
      <>
        <GameButton size="sm" as="a" href="https://naver.com">
          Naver
        </GameButton>
        <GameButton size="md" as="a" href="https://google.com">
          Google
        </GameButton>
      </>,
    );
    expect(screen.getByText('Naver')).toBeTruthy();
    expect(screen.getByText('Google')).toBeTruthy();
  });
  test('should render with onClick interaction', async () => {
    const onClick = vi.fn(() => 0);
    render(
      <>
        <GameButton size="sm" onClick={onClick}>
          Click
        </GameButton>
      </>,
    );
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
