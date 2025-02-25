import { prefixNamespaceObject } from "../../lib/namespace";
import { APIPostponeHandlers, namespace } from "./api-type";
import { draftBlueskyPost } from "./operations";

const handlers: APIPostponeHandlers = {
  draftBlueskyPost: (_, data) => draftBlueskyPost(data),
};

export const apiPostponeHandlers = prefixNamespaceObject(namespace, handlers);
