import React from "react";
import { AppContext } from "../../context/AppContext";
import { Header } from "../Header";
import { ProductsPage } from "../ProductsPage";
import { Routes, Route } from "react-router-dom";
import { Cart } from "../Cart";

import "./App.scss";

export class App extends React.Component {
  render() {
    return (
      <AppContext>
        <div className="app">
          <Header />
          <main className="main app__main">
            <Routes>
              <Route path="/all" element={<ProductsPage title="all" />} />
              <Route
                path="/clothes"
                element={<ProductsPage title="clothes" />}
              />
              <Route path="/tech" element={<ProductsPage title="tech" />} />
              <Route
                path="/cart"
                element={
                  <div className="cart-wrapper">
                    <div className="container">
                      <Cart isVisible={true} cartPage={true} />
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </AppContext>
    );
  }
}
