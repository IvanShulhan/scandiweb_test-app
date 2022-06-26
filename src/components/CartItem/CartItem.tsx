import React from "react";
import { client } from "../..";
import { Product } from "../../types/Product";
import { CartItemType } from "../../types/CartItemType";
import { GET_PRODUCT } from "../../queries/queries";
import classNames from "classnames";
import "./CartItem.scss";
import { getProducts } from "../../context/AppContext";

type Props = {
  item: CartItemType;
  currency: string;
  cartPage?: boolean;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
};

type State = {
  product: Product | null;
  price: number;
  imageIndex: number;
  attributes: {
    [key: string]: string;
  } | null;
};

export class CartItem extends React.PureComponent<Props, State> {
  state: State = {
    product: null,
    price: 0,
    imageIndex: 0,
    attributes: null,
  };

  changeAttributes() {
    const attributes = getProducts().find(
      (item: CartItemType) => item.id === this.props.item.id
    ).attributes;

    this.setState({ attributes });
  }

  componentDidMount() {
    client
      .query({
        query: GET_PRODUCT,
        variables: {
          id: this.props.item.id,
        },
      })
      .then((res) => {
        this.setState({ product: res.data.product });
      })
      .then(() => {
        this.changeAttributes();
      });
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

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (prevState.price === this.state.price) {
      this.setProductPrice();
    }

    console.log(this.props.item);
  }

  setProductPrice() {
    const productPrice = this.state.product?.prices
      .find((price) => price.currency.symbol === this.props.currency)
      ?.amount.toFixed(2);

    if (productPrice) {
      this.setState({ price: +productPrice });
    }
  }

  changeSelectedAttributeValues(id: string, name: string) {
    const cartItems = getProducts().map((item: CartItemType) => {
      if (item.id === this.props.item.id) {
        if (!item.attributes) {
          item.attributes = { [id]: name };
        } else {
          item.attributes = { ...item.attributes, [id]: name };
        }
      }

      return item;
    });

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    this.changeAttributes();
  }

  render() {
    const {
      product,
      price,
      imageIndex,
      attributes: selectedAttributes = {},
    } = this.state;
    const { currency, item, cartPage, increaseQuantity, decreaseQuantity } =
      this.props;

    return (
      <>
        {product && (
          <li
            className={classNames("cart-item", "cart__cart-item", {
              "cart-item--is-large": cartPage,
            })}
          >
            <div className="cart-item__sides">
              <div className="cart-item__side">
                <h3 className="cart-item__brand">{product.brand}</h3>
                <h4 className="cart-item__name">{product.name}</h4>
                <span className="cart-item__price">
                  {currency}
                  {price}
                </span>
                <ul className="cart-item__attributes">
                  {product.attributes.map((attribute) => (
                    <li className="cart-item__attribute" key={attribute.id}>
                      <span className="cart-item__attribute-name">
                        {attribute.name}:
                      </span>
                      <ul className="cart-item__attribute-list">
                        {attribute.items.map((attributeItem) => (
                          <li
                            key={attributeItem.id}
                            onClick={() => {
                              this.changeSelectedAttributeValues(
                                attribute.name,
                                attributeItem.value
                              );
                            }}
                            style={
                              attribute.name === "Color"
                                ? {
                                    backgroundColor: attributeItem.value,
                                  }
                                : {}
                            }
                            className={classNames(
                              "cart-item__attribute-list-item",
                              {
                                "cart-item__attribute-list-item--is-selected":
                                  selectedAttributes &&
                                  Object.values(selectedAttributes).includes(
                                    attributeItem.value
                                  ),
                                "cart-item__attribute-list-item--with-color":
                                  attribute.name === "Color",
                                "cart-item__attribute-list-item--with-color-selected":
                                  attribute.name === "Color" &&
                                  selectedAttributes?.Color ===
                                    attributeItem.value,
                              }
                            )}
                          >
                            {attribute.name !== "Color" && attributeItem.value}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="cart-item__side">
                <div className="cart-item__buttons">
                  <button
                    type="button"
                    className="cart-item__button cart-item__button--plus"
                    onClick={() => {
                      increaseQuantity(product.id);
                    }}
                  />
                  <span className="cart-item__quantity">{item.quantity}</span>
                  <button
                    type="button"
                    className="cart-item__button cart-item__button--minus"
                    onClick={() => decreaseQuantity(product.id)}
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
    );
  }
}
