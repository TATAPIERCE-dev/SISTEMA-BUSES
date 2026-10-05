import vine from "@vinejs/vine";

export const bookingValidator = vine.create({
  viajeId: vine.string().uuid(),
  holdId: vine.string().uuid().optional(),
  cardBrand: vine.enum(["Visa", "Mastercard"] as const),
  asientoIds: vine.array(vine.string().uuid()).minLength(1).maxLength(6),
  nombrePasajero: vine.string().minLength(3).maxLength(120),
  correoPasajero: vine.string().email().maxLength(120),
  telefonoPasajero: vine.string().maxLength(20).optional(),
  cardNumber: vine.string().regex(/^\d{16}$/),
  cardName: vine.string().minLength(3).maxLength(120),
  cardExpiry: vine.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/),
  cardCvv: vine.string().regex(/^\d{3,4}$/),
});
