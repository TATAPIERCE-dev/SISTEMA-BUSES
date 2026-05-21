import env from "#start/env";
import { defineConfig, transports } from "@adonisjs/mail";

const mailConfig = defineConfig({
  default: "smtp",

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or same transport with different
   * options.
   */
  mailers: {
    smtp: transports.smtp({
      host: env.get("SMTP_HOST") || "localhost",
      port: Number(env.get("SMTP_PORT")) || 587,
      /**
       * SMTP authentication
       * Uncomment if your SMTP server needs authentication
       */
      auth:
        env.get("SMTP_USERNAME") && env.get("SMTP_PASSWORD")
          ? {
              type: "login" as const,
              user: env.get("SMTP_USERNAME")!,
              pass: env.get("SMTP_PASSWORD")!,
            }
          : undefined,
    }),
  },
});

export default mailConfig;

declare module "@adonisjs/mail/types" {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
