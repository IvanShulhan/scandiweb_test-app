import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query {
    categories {
      name
    }
  }
`;

export const GET_CURRENCIES = gql`
  query {
    currencies {
      label
      symbol
    }
  }
`;

export const GET_CARDS = gql`
  query ($input: CategoryInput) {
    category(input: $input) {
      products {
        id
        name
        category
        inStock
        gallery
        prices {
          amount
          currency {
            symbol
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query ($id: String!) {
    product(id: $id) {
      id
      name
      brand
      gallery
      inStock
      description
      prices {
        amount
        currency {
          symbol
        }
      }
      attributes {
        id
        name
        items {
          id
          value
        }
      }
    }
  }
`;
