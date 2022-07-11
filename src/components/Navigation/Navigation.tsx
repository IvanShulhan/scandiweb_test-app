import React from "react";
import { client } from "../../index";
import { GET_CATEGORIES } from "../../queries/queries";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import "./Navigation.scss";
import { ShopContext } from '../../context/AppContext';

type State = {
  categories: string[];
  isVisibleNavigation: boolean;
};

export class Navigation extends React.Component<{}, State> {
  state = {
    categories: [],
    isVisibleNavigation: false,
  };

  componentDidMount() {
    client
      .query({
        query: GET_CATEGORIES,
      })
      .then((res) => {
        this.setState({ categories: res.data.categories });
      });
  }

  setIsVisible = () => {
    this.setState((state) => ({
      isVisibleNavigation: !state.isVisibleNavigation,
    }));
  };

  render() {
    const { categories, isVisibleNavigation } = this.state;

    return (
      <ShopContext.Consumer>
        {({ showCartPreview, toggleShowCartPreview }) => (
          <nav className="navigation header__navigation">
          <button
            className={classNames("navigation__burger-button", {
              "navigation__burger-button--is-open": isVisibleNavigation,
            })}
            type="button"
            onClick={this.setIsVisible}
          >
            Open navigation
          </button>
          <ul
            className={classNames("navigation__list", {
              "navigation__list--is-visible": isVisibleNavigation,
            })}
          >
            {categories.length &&
              categories.map((category) => {
                const { name } = category;
  
                return (
                  <li className="navigation__list-item" key={name}>
                    <NavLink
                      to={`/${name}`}
                      className={({ isActive }) =>
                        classNames("navigation__link", {
                          "navigation__link--is-active": isActive,
                        })
                      }
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        this.setState({ isVisibleNavigation: false });
                        if (showCartPreview) {
                          toggleShowCartPreview();
                        }
                      }}
                    >
                      {name}
                    </NavLink>
                  </li>
                );
              })}
          </ul>
        </nav>
        )}
      </ShopContext.Consumer>
    )
}}
