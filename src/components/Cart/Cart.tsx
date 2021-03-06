import React from "react";
import { CartItem } from "../CartItem";
import { LocalStorageType } from "../../types/LocalStorageType";
import { getProducts, ShopContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import "./Cart.scss";
import classNames from "classnames";

type Props = {
  changeShowCartPreview?: () => void;
  cartPage?: boolean;
};

type State = {
  products: LocalStorageType[];
  showMessage: boolean;
};

export class Cart extends React.Component<Props, State> {
  state: State = {
    products: [],
    showMessage: false,
  };

  componentDidMount = () => {
    this.setState({ products: getProducts() });
  };

  changeShowMessage = () => {
    this.setState({ showMessage: true });

    setTimeout(() => {
      this.setState({ showMessage: false });
    }, 3000);
  };

  render() {
    const { products, showMessage } = this.state;
    const { cartPage, changeShowCartPreview = () => {} } = this.props;

    console.log(products);
    

    return (
      <ShopContext.Consumer>
        {({ quantity, currency, totalPrice }) => (
          <section
            className={classNames("cart", {
              "cart--full-page": cartPage,
            })}
          >
            <h3 className="cart__title">
              {cartPage ? "Cart" : "My Bag"}
              {!!quantity && !cartPage && (
                <span className="cart__title-count">
                  {`, ${quantity} ${quantity > 1 ? " items" : " item"}`}
                </span>
              )}
            </h3>
            {quantity ? (
              <div className="cart__content">
                <ul className="cart__items">
                  {products.map((product) => (
                    <React.Fragment key={product.id}>
                      <CartItem
                        {...product}
                        currency={currency}
                        cartPage={cartPage}
                      />
                    </React.Fragment>
                  ))}
                </ul>
                <div className="cart__order-info">
                  {cartPage && (
                    <>
                      <div className="cart__info">
                        Tax 21%:
                        <span className="cart__info-value">
                          {currency}
                          {((totalPrice * 100) / 79 - totalPrice).toFixed(2)}
                        </span>
                      </div>
                      <div className="cart__info">
                        Quantity:
                        <span className="cart__info-value">{quantity}</span>
                      </div>
                    </>
                  )}
                  <div className="cart__price">
                    Total
                    {cartPage && ": "}
                    <span className="cart__price-value">
                      {currency}
                      {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="cart__buttons">
                  {!cartPage && (
                    <Link
                      className="cart__link"
                      to="/cart"
                      onClick={() => changeShowCartPreview()}
                    >
                      View bag
                    </Link>
                  )}
                  <button
                    className="cart__check-button"
                    type="button"
                    onClick={() => {
                      this.changeShowMessage();
                    }}
                  >
                    {cartPage ? "Order" : "Check out"}
                  </button>
                  {showMessage && (
                    <span className="cart__warning-message">
                      This feature is not available yet
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <span className="cart__info-text">
                There are no items in your cart yet
              </span>
            )}
          </section>
        )}
      </ShopContext.Consumer>
    );
  }
}
