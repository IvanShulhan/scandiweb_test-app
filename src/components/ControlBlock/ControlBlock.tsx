import classNames from "classnames";
import React from "react";
import { Cart } from "../Cart";
import { client } from "../..";
import { GET_CURRENCIES } from "../../queries/queries";
import { ShopContext } from "../../context/AppContext";

import "./ControlBlock.scss";

type State = {
  currencies: string[];
  showCartPreview: boolean;
};

export class ControlBlock extends React.Component<{}, State> {
  state = {
    currencies: [],
    isOpen: false,
    showCartPreview: false,
  };

  changeShowCartPreview = () => {
    this.setState((state) => ({ showCartPreview: !state.showCartPreview }));
  };

  componentDidMount() {
    client
      .query({
        query: GET_CURRENCIES,
      })
      .then((res) => {
        this.setState({ currencies: res.data.currencies });
      });
  }

  changeCurrensy = (value: string) => {
    localStorage.setItem("currency", value);
  };

  render() {
    const { currencies, showCartPreview } = this.state;

    return (
      <ShopContext.Consumer>
        {({
          quantity,
          currency,
          isOpenCurrencyList,
          toggleIsOpenCurrencyList,
          changeSelectedCurrency,
        }) => (
          <div className="control-block header__control-block">
            <div className="control-block__currency-select">
              <button
                className={classNames("control-block__currency-button", {
                  "control-block__currency-button--is-active":
                    isOpenCurrencyList,
                })}
                type="button"
                onClick={toggleIsOpenCurrencyList}
                disabled={showCartPreview}
              >
                {currency}
              </button>
              <ul
                className={classNames("control-block__currency-list", {
                  "control-block__currency-list--is-visible":
                    isOpenCurrencyList,
                })}
              >
                {currencies.map((currency) => {
                  const { symbol, label } = currency;

                  return (
                    <li
                      key={symbol}
                      className="control-block__currency-list-item"
                      onClick={() => {
                        this.changeCurrensy(symbol);
                        changeSelectedCurrency(symbol);
                        toggleIsOpenCurrencyList();
                      }}
                    >
                      <span>{symbol}</span>
                      {` ${label}`}
                    </li>
                  );
                })}
              </ul>
            </div>

            <button
              type="button"
              className="control-block__cart"
              onClick={() => {
                this.changeShowCartPreview();
              }}
              disabled={location.href.includes("cart")}
            >
              {!!quantity && (
                <span className="control-block__cart-count">{quantity}</span>
              )}
            </button>
            <Cart
              isVisible={showCartPreview}
              changeShowCartPreview={this.changeShowCartPreview}
            />
            {showCartPreview && <span className="control-block__mask" />}
          </div>
        )}
      </ShopContext.Consumer>
    );
  }
}
