import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import { addToCard, ShopContext } from "../../context/AppContext";
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
    isInStock: this.props.card.inStock,
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
              <Link
                className="card__link"
                to={`/${card.category}/${card.id}`}
                state={{ id: card.id }}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {!isInStock && (
                  <span className="card__image-box-mask">Out of stock</span>
                )}
                <img
                  src={card.gallery[0]}
                  alt="product photo"
                  className="card__image"
                />
              </Link>

              {isInStock && (
                <button
                  type="button"
                  className="card__add-to-cart-button"
                  onClick={() => {
                    addToCard(card, increaseQuantity);
                  }}
                >
                  <span className="card__add-to-cart-image">Add</span>
                </button>
              )}
            </div>
            <Link
              className="card__link"
              to={`/${card.category}/${card.id}`}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <h3 className="card__title">{card.name}</h3>
            </Link>

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
