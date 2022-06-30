import React from "react";
import { client } from "../..";
import { GET_CURRENCIES } from "../../queries/queries";
import { ShopContext } from "../../context/AppContext";
import { Cart } from "../Cart";
import classNames from "classnames";
import "./ControlBlock.scss";

type State = {
  currencies: string[];
};

export class ControlBlock extends React.Component<{}, State> {
  state = {
    currencies: [],
    isOpen: false,
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

  render() {
    const { currencies } = this.state;

    return (
      <ShopContext.Consumer>
        {({
          quantity,
          currency,
          isOpenCurrencyList,
          showCartPreview,
          toggleShowCartPreview,
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
              onClick={toggleShowCartPreview}
            >
              {!!quantity && (
                <span className="control-block__cart-count">{quantity}</span>
              )}
            </button>
            {showCartPreview && (
              <>
                <Cart changeShowCartPreview={toggleShowCartPreview} />
                <span className="control-block__mask" />
              </>
            )}
          </div>
        )}
      </ShopContext.Consumer>
    );
  }
}
