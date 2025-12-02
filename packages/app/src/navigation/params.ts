import { createParam } from "solito";

/**
 * Type-safe URL parameters using Solito
 */
export const { useParam } = createParam<{ id: string }>();
