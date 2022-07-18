import React from "react";
import { client } from "../..";
import { GET_PRODUCT } from "../../queries/queries";
import { Product } from "../../types/Product";
import { ShopContext } from "../../context/AppContext";
import { ProductDescription } from "../ProductDescription";
import classNames from "classnames";
import "./CartItem.scss";

type Props = {
  id: string;
  attributes: {
    [key: string]: string;
  };
  quantity: number;
  currency: string;
  cartPage?: boolean;
};

type State = {
  product: Product | null;
  price: number;
  imageIndex: number;
  productQuantity: number;
};

export class CartItem extends React.PureComponent<Props, State> {
  state: State = {
    product: null,
    price: 0,
    imageIndex: 0,
    productQuantity: 0,
  };

  componentDidMount() {
    const id = this.props.id.split("_")[0];

    client
      .query({
        query: GET_PRODUCT,
        variables: {
          id,
        },
      })
      .then((res) => {
        this.setState({ product: res.data.product });
      });

      this.setState({ productQuantity: this.props.quantity });
  }

  increaseProductQuantity() {
    this.setState((state) => ({ productQuantity: state.productQuantity + 1 }))
  }

  decreaseProductQuantity() {
    this.setState((state) => ({ productQuantity: state.productQuantity - 1 }))
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
    const { product, imageIndex, productQuantity } = this.state;
    const { cartPage, id, attributes } = this.props;

    return (
      <ShopContext.Consumer>
        {({ increaseQuantity, decreaseQuantity }) => (
          <>
            {product && !!productQuantity && (
              <li
                className={classNames("cart-item", "cart__cart-item", {
                  "cart-item--is-large": cartPage,
                })}
              >
                <div className="cart-item__sides">
                  <ProductDescription 
                    product={product} 
                    isLarge={cartPage} 
                    selectedAttributes={attributes}
                  />
                  <div className="cart-item__side">
                    <div className="cart-item__buttons">
                      <button
                        type="button"
                        className="cart-item__button cart-item__button--plus"
                        onClick={() => {
                          increaseQuantity(id);
                          this.increaseProductQuantity();
                        }}
                      />
                      <span className="cart-item__quantity">{productQuantity}</span>
                      <button
                        type="button"
                        className="cart-item__button cart-item__button--minus"
                        onClick={() => {
                          decreaseQuantity(id);
                          this.decreaseProductQuantity();
                        }}
                      />
                    </div>
                    <div className="cart-item__image-box">
                      <img
                        src={product.gallery[imageIndex]}
                        alt={product.name}
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
