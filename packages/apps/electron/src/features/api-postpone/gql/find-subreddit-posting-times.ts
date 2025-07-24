import { gql } from "graphql-tag";

export const FIND_SUBREDDIT_POSTING_TIMES = gql`
  query FindSubredditPostingTimes($subreddit: String!, $timezone: String!) {
    analytics(subreddit: $subreddit, timezone: $timezone) {
      id
      subreddit
      posts {
        day
        hour
        posts
        __typename
      }
      __typename
    }
  }
`;
