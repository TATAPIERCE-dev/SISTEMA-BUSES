/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  search: typeof routes['search']
  help: typeof routes['help']
  seatSelection: {
    show: typeof routes['seat_selection.show']
  }
  payment: {
    show: typeof routes['payment.show']
    invoice: typeof routes['payment.invoice']
  }
  bookingCreation: {
    hold: typeof routes['booking_creation.hold']
    store: typeof routes['booking_creation.store']
  }
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  bookings: {
    index: typeof routes['bookings.index']
    cancel: typeof routes['bookings.cancel']
  }
}
