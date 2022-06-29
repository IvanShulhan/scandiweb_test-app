type Item = {
  value: string;
  id: string;
};

export type Attribute = {
  id: string;
  name: string;
  items: Item[];
};

export type Price = {
  amount: number;
  currency: {
    symbol: string;
  };
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  inStock: boolean;
  description: string;
  gallery: string[];
  prices: Price[];
  attributes: Attribute[];
};
