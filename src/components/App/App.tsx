import React from "react";
import { AppContext } from "../../context/AppContext";
import { Header } from "../Header";
import { ProductsPage } from "../ProductsPage";
import { ProductDetails } from "../ProductDetails";
import { Routes, Route, Navigate } from "react-router-dom";
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
              <Route path="/" element={<Navigate to="/all" />} />
              <Route path="/all" element={<ProductsPage title="all" />} />
              <Route
                path="/clothes"
                element={<ProductsPage title="clothes" />}
              />
              <Route path="/clothes/:productId" element={<ProductDetails />} />
              <Route path="/tech" element={<ProductsPage title="tech" />} />
              <Route path="/tech/:productId" element={<ProductDetails />} />
              <Route
                path="/cart"
                element={
                  <div className="cart-wrapper">
                    <div className="container">
                      <Cart cartPage={true} />
                    </div>
                  </div>
                }
              />
              <Route
                path="*"
                element={
                  <div className="app__not-found-page">
                    <h2 className="app__not-found-page-title">
                      Page not found
                    </h2>
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
