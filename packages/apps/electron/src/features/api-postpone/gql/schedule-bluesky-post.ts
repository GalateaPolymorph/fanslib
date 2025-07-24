import { gql } from "graphql-tag";

export const SCHEDULE_BLUESKY_POST = gql`
  mutation ScheduleBlueskyPost($input: ScheduleBlueskyPostInput!) {
    scheduleBlueskyPost(input: $input) {
      success
      errors {
        message
      }
    }
  }
`;
