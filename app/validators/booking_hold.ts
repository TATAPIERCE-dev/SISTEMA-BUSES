import vine from "@vinejs/vine";

export const bookingHoldValidator = vine.create({
  viajeId: vine.string().uuid(),
  asientoIds: vine.array(vine.string().uuid()).minLength(1).maxLength(6),
  previousHoldId: vine.string().uuid().optional(),
});
