import React from "react";
import { client } from "../..";
import { ProductCard } from "../ProductCard";
import { GET_CARDS } from "../../queries/queries";
import { Product } from "../../types/Product";
import "./ProductsPage.scss";

type Props = {
  title: string;
};

type State = {
  cards: Product[];
};

export class ProductsPage extends React.Component<Props, State> {
  state: State = {
    cards: [],
  };

  updateCards(prevProps?: Props) {
    client
      .query({
        query: GET_CARDS,
        variables: {
          input: {
            title: this.props.title,
          },
        },
      })
      .then((res) => {
        if (prevProps !== this.props) {
          this.setState({ cards: [...res.data.category.products] });
        }
      });
  }

  componentDidMount() {
    this.updateCards();
  }

  componentDidUpdate(prevProps: Props) {
    this.updateCards(prevProps);
  }

  render() {
    const { title } = this.props;
    const { cards } = this.state;

    return (
      <section className="products-page main__products-page">
        <div className="container">
          <div className="products-page__inner">
            <h2 className="products-page__title">{title}</h2>
            <div className="products-page__content">
              <ul className="products-page__cards">
                {cards.map((card) => {
                  return (
                    <React.Fragment key={card.id}>
                      <ProductCard card={card} />
                    </React.Fragment>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
