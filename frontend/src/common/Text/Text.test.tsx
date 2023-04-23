import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from './Text';

describe('Text', () => {
  test('should render', () => {
    render(<Text>Hi</Text>);
    expect(screen.getByText('Hi')).toBeTruthy();
  });
});
