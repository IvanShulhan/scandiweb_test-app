import classNames from "classnames";
import React from "react";
import { NavLink } from "react-router-dom";
import { client } from "../../index";
import { GET_CATEGORIES } from "../../queries/queries";
import "./Navigation.scss";

type State = {
  categories: string[];
};

export class Navigation extends React.Component<{}, State> {
  state = {
    categories: [],
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

  render() {
    const { categories } = this.state;

    return (
      <nav className="navigation header__navigation">
        <ul className="navigation__list">
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
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    {name}
                  </NavLink>
                </li>
              );
            })}
        </ul>
      </nav>
    );
  }
}
