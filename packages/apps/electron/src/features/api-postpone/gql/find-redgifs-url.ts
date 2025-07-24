import { gql } from "graphql-tag";

export const FIND_REDGIFS_URL = gql`
  query FindRedgifsURL($filename: String!) {
    media(search: $filename) {
      objects {
        name
        hostedUrl
      }
    }
  }
`;
