import React from "react";
import { client } from "../..";
import { GET_PRODUCT } from "../../queries/queries";
import { addToCard, ShopContext } from "../../context/AppContext";
import { Product } from "../../types/Product";
import { ProductDescription } from "../ProductDescription";
import "./ProductDetails.scss";
import classNames from "classnames";

type State = {
  product: Product | null;
  selectedImageIndex: number;
};

export class ProductDetails extends React.PureComponent<{}, State> {
  state: State = {
    product: null,
    selectedImageIndex: 0,
  };

  setImageIndex = (i: number) => {
    this.setState({ selectedImageIndex: i });
  };

  getProductId() {
    const href = location.href.split("/");

    return href[href.length - 1];
  }

  componentDidMount() {
    client
      .query({
        query: GET_PRODUCT,
        variables: {
          id: this.getProductId(),
        },
      })
      .then((res) => {
        this.setState({ product: res.data.product });
      });
  }

  render() {
    const { product, selectedImageIndex } = this.state;
    const { setImageIndex } = this;

    console.log(product);

    return (
      <ShopContext.Consumer>
        {({ increaseQuantity, showCartPreview }) => (
          <div className="product-details">
            {product && (
              <div className="container">
                <div className="product-details__content">
                  <div className="product-details__gallery">
                    <div className="product-details__list-wrapper">
                      <ul className="product-details__list">
                        {product.gallery.map((item, i) => (
                          <li
                            className="product-details__list-item"
                            key={item}
                            onClick={() => setImageIndex(i)}
                          >
                            <img
                              className="product-details__image"
                              src={item}
                              alt="product photo"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="product-details__selected-image-box">
                      <img
                        src={product.gallery[selectedImageIndex]}
                        alt="selected product image"
                        className="product-details__selected-image"
                      />
                    </div>
                  </div>
                  <div className="product-details__description-box">
                    <ProductDescription
                      product={product}
                      isLarge={true}
                      isChangeOrder={true}
                      showCartPreview={showCartPreview}
                    />
                    <button
                      type="button"
                      className={classNames("product-details__button", {
                        "product-details__button--is-disabled":
                          !product.inStock,
                      })}
                      disabled={!product.inStock}
                      onClick={() => addToCard(product, increaseQuantity)}
                    >
                      Add to cart
                    </button>
                    <div className="product-details__desvription-text">
                      {
                        <div
                          dangerouslySetInnerHTML={{
                            __html: product.description,
                          }}
                        />
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ShopContext.Consumer>
    );
  }
}
