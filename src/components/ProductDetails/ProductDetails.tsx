import React from "react";
import { client } from "../..";
import { GET_PRODUCT } from "../../queries/queries";
import { addToCard, ShopContext } from "../../context/AppContext";
import { Product } from "../../types/Product";
import { ProductDescription } from "../ProductDescription";
import ReactHtmlParser from "react-html-parser";
import "./ProductDetails.scss";
import classNames from "classnames";

type State = {
  product: Product | null;
  selectedImageIndex: number;
  selectedAttributes: { [key: string]: string} | undefined;
  showInfoMessage: boolean;
};

export class ProductDetails extends React.PureComponent<{}, State> {
  state: State = {
    product: null,
    selectedImageIndex: 0,
    selectedAttributes: undefined,
    showInfoMessage: false,
  };

  setShowInfoMessage() {
    this.setState({ showInfoMessage: true });

    setTimeout(() => {
      this.setState({ showInfoMessage: false });
    }, 3000)
  }

  setImageIndex = (i: number) => {
    this.setState({ selectedImageIndex: i });
  };

  setSelectedAttributes = (name: string, value: string) => {    
    this.setState((state) => ({
      selectedAttributes: {
        ...state.selectedAttributes,
        [name]: value,
      }
    }))
  }

  getProductId() {
    // eslint-disable-next-line no-restricted-globals
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
    const { product, selectedImageIndex, selectedAttributes, showInfoMessage } = this.state;
    const { setImageIndex } = this;

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
                              alt={product.name}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="product-details__selected-image-box">
                      <img
                        src={product.gallery[selectedImageIndex]}
                        alt={product.name}
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
                      selectedAttributes={selectedAttributes}
                      setSelectedAttributes={this.setSelectedAttributes}
                    />
                    <button
                      type="button"
                      className={classNames("product-details__button", {
                        "product-details__button--is-disabled":
                          !product.inStock,
                      })}
                      disabled={!product.inStock}
                      onClick={() => {
                        if (selectedAttributes 
                            && Object.keys(selectedAttributes).length === Object.keys(product.attributes).length
                            ) {
                              addToCard(product, increaseQuantity, selectedAttributes)
                              } else {
                                this.setShowInfoMessage()
                              }
                      }}
                    >
                      Add to cart
                      {showInfoMessage && (<p className="product-details__info-text">
                        All attributes must be selected
                      </p>)}
                    </button>
                    
                    <div className="product-details__desvription-text">
                      {
                        <div>
                          {ReactHtmlParser(product.description)}
                        </div>
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
