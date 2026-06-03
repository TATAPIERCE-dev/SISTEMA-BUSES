import User from "#models/user";
import type { HttpContext } from "@adonisjs/core/http";

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render("auth/login", {});
  }

  async store({ request, auth, response, session }: HttpContext) {
    const { email, password, redirectTo } = request.all();
    try {
      const user = await User.verifyCredentials(email, password);
      await auth.use("web").login(user);
      if (redirectTo && typeof redirectTo === "string" && redirectTo.startsWith("/")) {
        return response.redirect().toPath(redirectTo);
      }
      return response.redirect().toRoute("home");
    } catch {
      session.flashErrors({
        email: "El correo electrónico o la contraseña no coinciden con nuestros registros.",
      });
      return response.redirect().back();
    }
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use("web").logout();
    response.redirect().toRoute("session.create");
  }
}
