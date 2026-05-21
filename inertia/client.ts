import { registry } from "~/generated/registry";
import { createTuyau } from "@tuyau/core/client";

export const client = createTuyau({
  baseUrl: import.meta.env.VITE_APP_URL || "http://localhost:3333",
  registry,
});

export const urlFor = client.urlFor;
