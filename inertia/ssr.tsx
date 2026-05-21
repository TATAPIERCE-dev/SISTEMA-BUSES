import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "@adonisjs/inertia/helpers";
import { type ComponentType } from "react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
import { client } from "~/client";
import { TuyauProvider } from "@adonisjs/inertia/react";

const appName = import.meta.env.VITE_APP_NAME || "Kit de inicio de Inertia  ";

createServer((page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
      return resolvePageComponent<ComponentType>(
        `./pages/${name}.tsx`,
        import.meta.glob<ComponentType>("./pages/**/*.tsx"),
      );
    },
    setup: ({ App, props }) => {
      return (
        <TuyauProvider client={client}>
          <App {...props} />
        </TuyauProvider>
      );
    },
  }),
);
