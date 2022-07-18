import React from "react";
import { Product } from "../../types/Product";
import { ShopContext } from "../../context/AppContext";
import classNames from "classnames";

import "./ProductDescription.scss";

type Props = {
  product: Product;
  isLarge?: boolean;
  isChangeOrder?: boolean;
  showCartPreview?: boolean;
  selectedAttributes?: {[key: string]: string};
  setSelectedAttributes?: (n: string, v: string) => void;
};

type State = {
  isRender: boolean;
};

export class ProductDescription extends React.PureComponent<Props, State> {
  state: State = {
    isRender: false,
  };

  render() {
    const { 
      product, 
      isLarge, 
      isChangeOrder, 
      selectedAttributes, 
      setSelectedAttributes 
    } = this.props;

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
                  key={`${attribute.name}-${product.name}`}
                >
                  <span className="product-description__attribute-name">
                    {attribute.name}:
                  </span>
                  <ul className="product-description__attribute-list">
                    {attribute.items.map((attributeItem) => (
                      <li
                        key={attributeItem.id}
                        onClick={() => {
                          if (!setSelectedAttributes) {
                            return
                          }

                          setSelectedAttributes(
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
                            selectedAttributes &&
                              attribute.name !== "Color" &&
                              Object.entries(selectedAttributes).some(
                                (item) =>
                                  item[0] === attribute.name &&
                                  item[1] === attributeItem.value
                              ),
                            "product-description__attribute-list-item--with-color":
                              attribute.name === "Color",
                            "product-description__attribute-list-item--with-color-selected":
                              attribute.name === "Color" &&
                              selectedAttributes?.Color === attributeItem.value,
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
