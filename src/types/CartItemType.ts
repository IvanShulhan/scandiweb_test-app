export type CartItemType = {
  id: string;
  quantity: number;
  attributes: {
    [key: string]: string;
  };
};
