import React from "react";
import { client } from "../..";
import { Product } from "../../types/Product";
import { ShopContext } from "../../context/AppContext";
import { GET_PRODUCT } from "../../queries/queries";
import classNames from "classnames";
import "./CartItem.scss";
import { ProductDescription } from "../ProductDescription";

type Props = {
  id: string;
  attributes: {
    [key: string]: string;
  };
  quantity: number;
  currency: string;
  cartPage?: boolean;
  setTotalPrice(): void;
};

type State = {
  product: Product | null;
  price: number;
  imageIndex: number;
  reRender: boolean;
  quantity: number;
};

export class CartItem extends React.PureComponent<Props, State> {
  state: State = {
    product: null,
    price: 0,
    imageIndex: 0,
    reRender: false,
    quantity: this.props.quantity,
  };

  componentDidMount() {
    client
      .query({
        query: GET_PRODUCT,
        variables: {
          id: this.props.id,
        },
      })
      .then((res) => {
        this.setState({ product: res.data.product });
      });
  }

  increaseProductQuantity() {
    this.setState((state) => ({
      quantity: state.quantity + 1,
    }));
    this.props.setTotalPrice();
  }

  decreaseProductQuantity() {
    this.setState((state) => ({
      quantity: state.quantity - 1,
    }));
    this.props.setTotalPrice();
  }

  increaseImageIndex() {
    const { imageIndex, product } = this.state;

    if (product && imageIndex === product.gallery.length - 1) {
      return;
    }

    this.setState((state) => ({ imageIndex: state.imageIndex + 1 }));
  }

  decreaseImageIndex() {
    const { imageIndex } = this.state;

    if (imageIndex === 0) {
      return;
    }

    this.setState((state) => ({ imageIndex: state.imageIndex - 1 }));
  }

  render() {
    const { product, imageIndex, quantity } = this.state;
    const { cartPage } = this.props;

    return (
      <ShopContext.Consumer>
        {({ increaseQuantity, decreaseQuantity }) => (
          <>
            {product && !!quantity && (
              <li
                className={classNames("cart-item", "cart__cart-item", {
                  "cart-item--is-large": cartPage,
                })}
              >
                <div className="cart-item__sides">
                  <ProductDescription product={product} isLarge={cartPage} />
                  <div className="cart-item__side">
                    <div className="cart-item__buttons">
                      <button
                        type="button"
                        className="cart-item__button cart-item__button--plus"
                        onClick={() => {
                          increaseQuantity(product.id);
                          this.increaseProductQuantity();
                        }}
                      />
                      <span className="cart-item__quantity">{quantity}</span>
                      <button
                        type="button"
                        className="cart-item__button cart-item__button--minus"
                        onClick={() => {
                          decreaseQuantity(product.id);
                          this.decreaseProductQuantity();
                        }}
                      />
                    </div>
                    <div className="cart-item__image-box">
                      <img
                        src={product.gallery[imageIndex]}
                        alt="product photo"
                        className="cart-item__image"
                      />
                      {cartPage && (
                        <div className="cart-item__pagination">
                          <button
                            type="button"
                            onClick={() => this.decreaseImageIndex()}
                            className="cart-item__pagination-button cart-item__pagination-button--left"
                            disabled={imageIndex === 0}
                          />
                          <button
                            type="button"
                            onClick={() => this.increaseImageIndex()}
                            className="cart-item__pagination-button cart-item__pagination-button--right"
                            disabled={imageIndex === product.gallery.length - 1}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            )}
          </>
        )}
      </ShopContext.Consumer>
    );
  }
}
