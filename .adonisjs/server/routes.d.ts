import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'search': { paramsTuple?: []; params?: {} }
    'help': { paramsTuple?: []; params?: {} }
    'seat_selection.show': { paramsTuple?: []; params?: {} }
    'payment.show': { paramsTuple?: []; params?: {} }
    'payment.invoice': { paramsTuple?: []; params?: {} }
    'booking_creation.hold': { paramsTuple?: []; params?: {} }
    'booking_creation.store': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'bookings.index': { paramsTuple?: []; params?: {} }
    'bookings.cancel': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'search': { paramsTuple?: []; params?: {} }
    'help': { paramsTuple?: []; params?: {} }
    'seat_selection.show': { paramsTuple?: []; params?: {} }
    'payment.show': { paramsTuple?: []; params?: {} }
    'payment.invoice': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'bookings.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'search': { paramsTuple?: []; params?: {} }
    'help': { paramsTuple?: []; params?: {} }
    'seat_selection.show': { paramsTuple?: []; params?: {} }
    'payment.show': { paramsTuple?: []; params?: {} }
    'payment.invoice': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'bookings.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'booking_creation.hold': { paramsTuple?: []; params?: {} }
    'booking_creation.store': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'bookings.cancel': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}