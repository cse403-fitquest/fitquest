import { APIResponse } from './general';
import { Item } from './item';

export type GetShopItemsResponse = APIResponse & {
  data: Item[];
};
