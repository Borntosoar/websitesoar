// Single source for the shipping/returns facts. The FAQ, the PDP disclosure,
// and the /policies page all read these so the numbers can never drift out of
// sync (council note: three hand-maintained copies would diverge).
export const SHIP = {
  processing: "2–5 business days",
  returnDays: 14,
};

// One-line summary used on the PDP details accordion.
export const SHIPPING_SUMMARY = `Ships from Alberta within ${SHIP.processing}, tracked. Free standard shipping in Canada; international at checkout. ${SHIP.returnDays}-day returns on unworn pieces.`;
