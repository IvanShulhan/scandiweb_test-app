import React from "react";
import { Product } from "../../types/Product";
import { ShopContext } from "../../context/AppContext";
import { LocalStorageType } from "../../types/LocalStorageType";
import classNames from "classnames";

import "./ProductDescription.scss";

type Props = {
  product: Product;
  isLarge?: boolean;
  isChangeOrder?: boolean;
};

type State = {
  attributes: {
    [key: string]: string;
  } | null;
  isRender: boolean;
};

export class ProductDescription extends React.PureComponent<Props, State> {
  state: State = {
    attributes: null,
    isRender: false,
  };

  setSelectedAttributes(id: string, name: string) {
    const { product } = this.props;

    const selecteAttributes = JSON.parse(
      localStorage.getItem("selecteAttributes") || "[]"
    );

    if (
      !selecteAttributes.some(
        (item: LocalStorageType) => item.id === product.id
      )
    ) {
      localStorage.setItem(
        "selecteAttributes",
        JSON.stringify([
          ...selecteAttributes,
          {
            id: product.id,
            attributes: {
              [id]: name,
            },
          },
        ])
      );
    } else {
      const changedAttributes = selecteAttributes.map(
        (item: LocalStorageType) => {
          if (item.id === product.id) {
            item.attributes = { ...item.attributes, [id]: name };
          }

          return item;
        }
      );

      localStorage.setItem(
        "selecteAttributes",
        JSON.stringify(changedAttributes)
      );
    }

    this.setState({ isRender: !this.state.isRender });
  }

  getAttributes = () => {
    const { id } = this.props.product;

    const attributes = JSON.parse(
      localStorage.getItem("selecteAttributes") || "[]"
    );

    const productAttributes = attributes.find(
      (item: LocalStorageType) => item.id === id
    )?.attributes;

    this.setState({ attributes: productAttributes });
  };

  componentDidMount() {
    this.getAttributes();
  }

  componentDidUpdate(_: Props, prevState: State) {
    if (prevState.isRender !== this.state.isRender) {
      this.getAttributes();
    }
  }

  render() {
    const { product, isLarge, isChangeOrder } = this.props;
    const { attributes } = this.state;

    return (
      <ShopContext.Consumer>
        {({ currency }) => (
          <div
            className={classNames("product-description", {
              "product-description--is-large": isLarge,
              "product-description--with-changed-order": isChangeOrder,
            })}
          >
            <h3 className="product-description__brand">{product.brand}</h3>
            <h4 className="product-description__name">{product.name}</h4>
            <span className="product-description__price">
              {isChangeOrder && (
                <h4 className="product-description__price-title">Price:</h4>
              )}
              {currency}
              {product.prices
                .find((price) => price.currency.symbol === currency)
                ?.amount.toFixed(2)}
            </span>
            <ul className="product-description__attributes">
              {product.attributes.map((attribute) => (
                <li
                  className="product-description__attribute"
                  key={attribute.id}
                >
                  <span className="product-description__attribute-name">
                    {attribute.name}:
                  </span>
                  <ul className="product-description__attribute-list">
                    {attribute.items.map((attributeItem) => (
                      <li
                        key={attributeItem.id}
                        onClick={() => {
                          this.setSelectedAttributes(
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
                          "product-description__attribute-list-item",
                          {
                            "product-description__attribute-list-item--is-selected":
                              attributes &&
                              attribute.name !== "Color" &&
                              Object.entries(attributes).some(
                                (item) =>
                                  item[0] === attribute.name &&
                                  item[1] === attributeItem.value
                              ),
                            "product-description__attribute-list-item--with-color":
                              attribute.name === "Color",
                            "product-description__attribute-list-item--with-color-selected":
                              attribute.name === "Color" &&
                              attributes?.Color === attributeItem.value,
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
        )}
      </ShopContext.Consumer>
    );
  }
}
