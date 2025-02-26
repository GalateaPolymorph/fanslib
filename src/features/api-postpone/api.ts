import { prefixNamespaceObject } from "../../lib/namespace";
import { APIPostponeHandlers, namespace } from "./api-type";
import { draftBlueskyPost, findRedgifsURL } from "./operations";

const handlers: APIPostponeHandlers = {
  draftBlueskyPost: (_, data) => draftBlueskyPost(data),
  findRedgifsURL: (_, data) => findRedgifsURL(data),
};

export const apiPostponeHandlers = prefixNamespaceObject(namespace, handlers);
