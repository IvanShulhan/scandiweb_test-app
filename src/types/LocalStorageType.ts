import { Price } from "./Product";

export type LocalStorageType = {
  id: string;
  quantity: number;
  attributes: {
    [key: string]: string;
  };
  prices: Price[];
};
