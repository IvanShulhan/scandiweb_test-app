import React from "react";
import { addToCard, ShopContext } from "../../context/AppContext";
import { Product } from "../../types/Product";
import { Link } from "react-router-dom";
import classNames from "classnames";
import "./ProductCard.scss";

type Props = {
  card: Product;
};

export class ProductCard extends React.PureComponent<Props> {


  render() {
    const { card } = this.props;

    return (
      <ShopContext.Consumer>
        {({ currency, increaseQuantity }) => (
          <li
            className={classNames("card", "products-page__card", {
              "card--is-out-of-stock": !card.inStock,
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
                {!card.inStock && (
                  <span className="card__image-box-mask">Out of stock</span>
                )}
                <img
                  src={card.gallery[0]}
                  alt={card.name}
                  className="card__image"
                />
              </Link>

              {card.inStock && (
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
              <h3 className="card__title">{`${card.brand} ${card.name}`}</h3>
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
