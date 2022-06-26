type Item = {
  value: string;
  id: string;
};

export type Attribute = {
  id: string;
  name: string;
  items: Item[];
};

type Price = {
  amount: number;
  currency: {
    symbol: string;
  };
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  inStock: boolean;
  gallery: string[];
  prices: Price[];
  attributes: Attribute[];
};
