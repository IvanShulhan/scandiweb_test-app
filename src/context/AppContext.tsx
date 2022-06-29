import React, { ReactNode } from "react";
import { LocalStorageType } from "../types/LocalStorageType";
import { Product } from "../types/Product";

export type ShopContextType = {
  quantity: number;
  currency: string;
  isOpenCurrencyList: boolean;
  totalPrice: number;
  toggleIsOpenCurrencyList(): void;
  changeSelectedCurrency(value: string): void;
  increaseQuantity(id: string): void;
  decreaseQuantity(id: string): void;
};

export const ShopContext = React.createContext<ShopContextType>({
  quantity: 0,
  currency: "$",
  isOpenCurrencyList: false,
  totalPrice: 0,
  toggleIsOpenCurrencyList() {},
  changeSelectedCurrency(value) {},
  increaseQuantity(id) {},
  decreaseQuantity(id) {},
});

const itemsQuantity = JSON.parse(
  localStorage.getItem("cartItems") || "[]"
).reduce((acc: number, item: LocalStorageType) => acc + item.quantity, 0);

export const addToCard = (product: Product, callback: (id: string) => void) => {
  const cartItems: LocalStorageType[] = JSON.parse(
    localStorage.getItem("cartItems") || "[]"
  );

  if (!cartItems.some((item) => item.id === product.id)) {
    callback(product.id);
    localStorage.setItem(
      "cartItems",
      JSON.stringify([
        ...cartItems,
        {
          id: product.id,
          quantity: 1,
          prices: product.prices,
        },
      ])
    );
  }
};

export const currencySymbol = localStorage.getItem("currency") || "$";

type State = {
  quantity: number;
  currency: string;
  isOpenCurrencyList: boolean;
  totalPrice: number;
};

type Props = {
  children?: ReactNode;
};

export const getProducts = () => {
  return JSON.parse(localStorage.getItem("cartItems") || "[]");
};

export class AppContext extends React.Component<Props, State> {
  state: State = {
    quantity: itemsQuantity,
    currency: currencySymbol,
    isOpenCurrencyList: false,
    totalPrice: 0,
  };

  setTotalPrice = () => {
    const { currency } = this.state;
    const products: LocalStorageType[] = getProducts();

    const productsPrice = products.reduce((acc, product) => {
      const price: number =
        product.prices.find((p) => p.currency.symbol === currency)?.amount || 0;

      return acc + price * product.quantity;
    }, 0);

    this.setState({ totalPrice: productsPrice });
  };

  changeSelectedCurrency = (value: string) => {
    localStorage.setItem("currency", value);

    this.setState({ currency: value });
  };

  increaseQuantity = (id = "") => {
    this.setState((state) => {
      return { quantity: state.quantity + 1 };
    });

    const products = getProducts().map((item: LocalStorageType) => {
      if (item.id === id) {
        item.quantity++;
      }

      return item;
    });

    if (products) {
      localStorage.setItem("cartItems", JSON.stringify(products));
    }
  };

  decreaseQuantity = (id = "") => {
    this.setState((state) => {
      return { quantity: state.quantity - 1 };
    });

    const productQuantity = getProducts().find(
      (item: LocalStorageType) => item.id === id
    ).quantity;

    const products =
      productQuantity > 1
        ? getProducts().map((item: LocalStorageType) => {
            if (item.id === id) {
              item.quantity--;
            }

            return item;
          })
        : getProducts().filter((item: LocalStorageType) => item.id !== id);

    if (products) {
      localStorage.setItem("cartItems", JSON.stringify(products));
    }
  };

  toggleIsOpenCurrencyList = () => {
    this.setState((state) => ({
      isOpenCurrencyList: !state.isOpenCurrencyList,
    }));
  };

  componentDidMount() {
    this.setTotalPrice();
  }

  componentDidUpdate(_: Props, prevState: State) {
    if (
      prevState.currency !== this.state.currency ||
      prevState.quantity !== this.state.quantity
    ) {
      this.setTotalPrice();
    }
  }

  render() {
    const {
      changeSelectedCurrency,
      increaseQuantity,
      decreaseQuantity,
      toggleIsOpenCurrencyList,
    } = this;
    const { quantity, currency, totalPrice, isOpenCurrencyList } = this.state;

    return (
      <ShopContext.Provider
        value={{
          quantity,
          currency,
          isOpenCurrencyList,
          totalPrice,
          toggleIsOpenCurrencyList,
          changeSelectedCurrency,
          increaseQuantity,
          decreaseQuantity,
        }}
      >
        <div
          onClick={(event) => {
            const element = event.target as HTMLBodyElement;

            if (
              !element.matches(".control-block__currency-button") &&
              isOpenCurrencyList
            ) {
              this.setState({ isOpenCurrencyList: false });
            }
          }}
        >
          {this.props.children}
        </div>
      </ShopContext.Provider>
    );
  }
}
