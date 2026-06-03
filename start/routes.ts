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
router
  .on("/search")
  .renderInertia("TripSearchPage", undefined as never)
  .as("search");
router
  .on("/help")
  .renderInertia("HelpPage", undefined as never)
  .as("help");
router.on("/seats").renderInertia("SeatSelectionPage", undefined as never);

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
