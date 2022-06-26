import classNames from "classnames";
import React from "react";
import { ShopContext } from "../../context/AppContext";
import { CartItemType } from "../../types/CartItemType";
import { Product } from "../../types/Product";
import "./ProductCard.scss";

type Props = {
  card: Product;
};

type State = {
  isInStock: boolean;
};

export class ProductCard extends React.PureComponent<Props, State> {
  state = {
    isInStock: false,
  };

  componentDidMount() {
    this.setState({ isInStock: this.props.card.inStock });
  }

  addToCard = (product: Product, callback: (id: string) => void) => {
    const cartItems: CartItemType[] = JSON.parse(
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
          },
        ])
      );
    }
  };

  render() {
    const { isInStock } = this.state;
    const { card } = this.props;

    return (
      <ShopContext.Consumer>
        {({ currency, increaseQuantity }) => (
          <li
            className={classNames("card", "products-page__card", {
              "card--is-out-of-stock": !isInStock,
            })}
          >
            <div className="card__image-box">
              {!isInStock && (
                <span className="card__image-box-mask">Out of stock</span>
              )}
              <img
                src={card.gallery[0]}
                alt="product photo"
                className="card__image"
              />
              {isInStock && (
                <button
                  type="button"
                  className="card__add-to-cart-button"
                  onClick={() => {
                    this.addToCard(card, increaseQuantity);
                  }}
                >
                  <span className="card__add-to-cart-image">Add</span>
                </button>
              )}
            </div>
            <h3 className="card__title">{card.name}</h3>

            <span className="card__price">
              {currency}
              {card.prices
                .find((price) => price.currency.symbol === currency)
                ?.amount.toFixed(2)}
            </span>
          </li>
        )}
      </ShopContext.Consumer>
    );
  }
}
