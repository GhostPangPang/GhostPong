export type LoginInfo = {
  email: string;

  /**
   * id === null -> unregistered
   * id !== null -> registered
   */
  id: number | null;
};
