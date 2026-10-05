/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from "#start/kernel";
import { controllers } from "#generated/controllers";
import router from "@adonisjs/core/services/router";

router
  .on("/")
  .renderInertia("home", undefined as never)
  .as("home");
router.get("/search", [controllers.Trips, "index"]).as("search");
router
  .on("/help")
  .renderInertia("HelpPage", undefined as never)
  .as("help");
router.get("/seats", [controllers.SeatSelection, "show"]);
router.get("/pagar", [controllers.Payment, "show"]);
router.get("/factura", [controllers.Payment, "invoice"]);
router.post("/bookings/hold", [controllers.BookingCreation, "hold"]);
router.post("/bookings", [controllers.BookingCreation, "store"]);

router.group(() => {
  router.on("/admin/fleet").renderInertia("FleetPage", undefined as never);
  router.on("/admin/configurator").renderInertia("BusConfiguratorPage", undefined as never);
});

router
  .group(() => {
    router.get("signup", [controllers.NewAccount, "create"]);
    router.post("signup", [controllers.NewAccount, "store"]);

    router.get("login", [controllers.Session, "create"]);
    router.post("login", [controllers.Session, "store"]);
  })
  .use(middleware.guest());

router
  .group(() => {
    router.post("logout", [controllers.Session, "destroy"]);
    router.get("bookings", [controllers.Bookings, "index"]).as("bookings.index");
    router.post("bookings/:id/cancel", [controllers.Bookings, "cancel"]).as("bookings.cancel");
  })
  .use(middleware.auth());
