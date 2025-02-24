import { prefixNamespaceObject } from "../../lib/namespace";
import { APIRedGIFsHandlers, namespace } from "./api-type";
import { postToRedGIFs } from "./operations";

const handlers: APIRedGIFsHandlers = {
  post: (_, data) => postToRedGIFs(data),
};

export const apiRedGIFsHandlers = prefixNamespaceObject(namespace, handlers);
