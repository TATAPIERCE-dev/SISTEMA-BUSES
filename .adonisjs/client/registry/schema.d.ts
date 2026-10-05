/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'search': {
    methods: ["GET","HEAD"]
    pattern: '/search'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/trips_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/trips_controller').default['index']>>>
    }
  }
  'help': {
    methods: ["GET","HEAD"]
    pattern: '/help'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'seat_selection.show': {
    methods: ["GET","HEAD"]
    pattern: '/seats'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/seat_selection_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/seat_selection_controller').default['show']>>>
    }
  }
  'payment.show': {
    methods: ["GET","HEAD"]
    pattern: '/pagar'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payment_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/payment_controller').default['show']>>>
    }
  }
  'payment.invoice': {
    methods: ["GET","HEAD"]
    pattern: '/factura'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payment_controller').default['invoice']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/payment_controller').default['invoice']>>>
    }
  }
  'booking_creation.hold': {
    methods: ["POST"]
    pattern: '/bookings/hold'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/booking_hold').bookingHoldValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/booking_hold').bookingHoldValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/booking_creation_controller').default['hold']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/booking_creation_controller').default['hold']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'booking_creation.store': {
    methods: ["POST"]
    pattern: '/bookings'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/booking').bookingValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/booking').bookingValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/booking_creation_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/booking_creation_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'bookings.index': {
    methods: ["GET","HEAD"]
    pattern: '/bookings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookings_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/bookings_controller').default['index']>>>
    }
  }
  'bookings.cancel': {
    methods: ["POST"]
    pattern: '/bookings/:id/cancel'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookings_controller').default['cancel']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/bookings_controller').default['cancel']>>>
    }
  }
}
