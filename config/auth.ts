import { defineConfig } from "@adonisjs/auth";
import { sessionGuard, sessionUserProvider } from "@adonisjs/auth/session";
import type {
  Authenticators,
  GuardConfigProvider,
  GuardFactory,
  InferAuthEvents,
  InferAuthenticators,
} from "@adonisjs/auth/types";
import type { ConfigProvider } from "@adonisjs/core/types";

type ResolvedAuthConfig<
  KnownGuards extends Record<string, GuardFactory | GuardConfigProvider<GuardFactory>>,
> = {
  default: keyof KnownGuards;
  guards: {
    [K in keyof KnownGuards]: KnownGuards[K] extends GuardConfigProvider<infer Guard>
      ? Guard
      : KnownGuards[K];
  };
};

const guards = {
  web: sessionGuard({
    useRememberMeTokens: false,
    provider: sessionUserProvider({
      model: () => import("#models/user"),
    }),
  }),
};

const authConfig: ConfigProvider<ResolvedAuthConfig<typeof guards>> = defineConfig({
  default: "web",
  guards,
});

export default authConfig;

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module "@adonisjs/auth/types" {
  export interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module "@adonisjs/core/types" {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
