export type LoginInfo = {
  provider: '42' | 'google';
  email: string;
  id: number | null;
  /**
   * id === null -> unregistered
   * id !== null -> registered
   */
};
