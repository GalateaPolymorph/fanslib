import { DocumentNode, print } from "graphql";
import { loadSettings } from "../settings/load";

type PostponeResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export const fetchPostpone = async <T, V = unknown>(
  query: DocumentNode,
  variables: V
): Promise<T> => {
  const settings = await loadSettings();

  if (!settings.postponeToken) {
    throw new Error("Postpone token not configured. Please add it in Settings.");
  }

  const body = JSON.stringify({
    query: print(query),
    variables,
  });

  const response = await fetch("https://api.postpone.app/gql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.postponeToken}`,
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const result = (await response.json()) as PostponeResponse<T>;

  if (result.errors) {
    throw new Error(`GraphQL Error: ${result.errors[0].message}`);
  }

  if (!result.data) {
    throw new Error("No data returned from Postpone API");
  }

  return result.data;
};
