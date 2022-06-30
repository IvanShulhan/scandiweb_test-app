import React from "react";
import { Navigation } from "../Navigation";
import { ControlBlock } from "../ControlBlock";
import "./Header.scss";

export class Header extends React.Component {
  render() {
    return (
      <header className="header app__header">
        <div className="container">
          <div className="header__inner">
            <Navigation />
            <span className="header__logo" />
            <ControlBlock />
          </div>
        </div>
      </header>
    );
  }
}
