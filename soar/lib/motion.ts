// One shared motion rhythm for the whole site. Every quiet reveal, modal, hover
// settle, and gate fade uses this single calm ease-out so the storefront feels
// like one hand made it — brand §6/§11: quiet, intentional, never drifting.
export const EASE_QUIET = [0.22, 1, 0.36, 1] as const;

// Same curve for plain CSS transitions (the Tilt reset, etc.).
export const EASE_QUIET_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";
