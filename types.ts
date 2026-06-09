export type User = {
  id: number;
  name: string;
};

export type Context = {
  users: User[];
  draftUser: User | null;
  draftDeleteId: number | null;
  retryCount: number;
};