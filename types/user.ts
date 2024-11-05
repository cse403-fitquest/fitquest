import { User } from './auth';
import { APIResponse } from './general';

export type CreateUserResponse = APIResponse & {};

export type GetUserResponse = APIResponse & {
  data: {
    user: User;
  } | null;
};
