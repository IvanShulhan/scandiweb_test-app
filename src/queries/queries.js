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

const Product = gql`
  fragment Product on Product {
    id
    name
    brand
    category
    description
    gallery
    inStock
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
`

export const GET_PRODUCTS = gql`
  ${Product}
  query ($input: CategoryInput) {
    category(input: $input) {
      products {
        ...Product
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  ${Product}
  query ($id: String!) {
    product(id: $id) {
      ...Product
    }
  }
`;
