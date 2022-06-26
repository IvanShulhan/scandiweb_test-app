import React, { ReactNode } from "react";
import { CartItemType } from "../types/CartItemType";

export type ShopContextType = {
  quantity: number;
  currency: string;
  isOpenCurrencyList: boolean;
  toggleIsOpenCurrencyList(): void;
  changeSelectedCurrency(value: string): void;
  increaseQuantity(id: string): void;
  decreaseQuantity(id: string): void;
};

export const ShopContext = React.createContext<ShopContextType>({
  quantity: 0,
  currency: "$",
  isOpenCurrencyList: false,
  toggleIsOpenCurrencyList() {},
  changeSelectedCurrency(value) {},
  increaseQuantity(id) {},
  decreaseQuantity(id) {},
});

const itemsQuantity = JSON.parse(
  localStorage.getItem("cartItems") || "[]"
).reduce((acc: number, item: CartItemType) => acc + item.quantity, 0);

const currencySymbol = localStorage.getItem("currency") || "$";

type State = {
  quantity: number;
  currency: string;
  isOpenCurrencyList: boolean;
};

type Props = {
  children?: ReactNode;
};

export const getProducts = () => {
  return JSON.parse(localStorage.getItem("cartItems") || "[]");
};

export class AppContext extends React.Component<Props, State> {
  state = {
    quantity: itemsQuantity,
    currency: currencySymbol,
    isOpenCurrencyList: false,
  };

  changeSelectedCurrency = (value: string) => {
    this.setState({ currency: value });
  };

  increaseQuantity = (id = "") => {
    this.setState((state) => {
      return { quantity: state.quantity + 1 };
    });

    const products = getProducts().map((item: CartItemType) => {
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
      (item: CartItemType) => item.id === id
    ).quantity;

    const products =
      productQuantity > 1
        ? getProducts().map((item: CartItemType) => {
            if (item.id === id) {
              item.quantity--;
            }

            return item;
          })
        : getProducts().filter((item: CartItemType) => item.id !== id);

    if (products) {
      localStorage.setItem("cartItems", JSON.stringify(products));
    }
  };

  toggleIsOpenCurrencyList = () => {
    this.setState((state) => ({
      isOpenCurrencyList: !state.isOpenCurrencyList,
    }));
  };

  render() {
    const {
      changeSelectedCurrency,
      increaseQuantity,
      decreaseQuantity,
      toggleIsOpenCurrencyList,
    } = this;
    const { quantity, currency, isOpenCurrencyList } = this.state;

    return (
      <ShopContext.Provider
        value={{
          quantity,
          currency,
          isOpenCurrencyList,
          toggleIsOpenCurrencyList,
          changeSelectedCurrency,
          increaseQuantity,
          decreaseQuantity,
        }}
      >
        <div
          onClick={(event) => {
            const element = event.target as HTMLBodyElement;
            if (!element.matches(".control-block__currency-button")) {
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
