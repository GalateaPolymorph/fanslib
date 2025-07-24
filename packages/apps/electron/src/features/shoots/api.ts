import { prefixNamespaceObject } from "../../lib/namespace";
import { ShootHandlers, namespace } from "./api-type";
import { createShoot, deleteShoot, getShoot, listShoots, updateShoot } from "./operations";

export const handlers: ShootHandlers = {
  create: async (_, payload) => {
    return createShoot(payload);
  },

  get: async (_, id) => {
    return getShoot(id);
  },

  getAll: async (_, params) => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 50;
    return listShoots({ page, limit, ...params });
  },

  update: async (_, id, payload) => {
    return updateShoot(id, payload);
  },

  delete: async (_, id) => {
    return deleteShoot(id);
  },
};

export const shootHandlers = prefixNamespaceObject(namespace, handlers);
