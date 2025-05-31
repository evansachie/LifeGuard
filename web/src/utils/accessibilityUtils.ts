/**
 * Utility functions for accessibility
 */

/**
 * Returns the proper aria-expanded attribute object with string literal value
 * @param isExpanded - Boolean indicating if the element is expanded
 * @returns Object to spread into element props
 */
export const ariaExpanded = (isExpanded: boolean): { 'aria-expanded': 'true' | 'false' } => {
  return isExpanded ? { 'aria-expanded': 'true' } : { 'aria-expanded': 'false' };
};

/**
 * Returns the proper string literal for ARIA boolean attributes
 * @param value - Boolean value to convert to ARIA string
 * @returns "true" or "false" string literal
 */
export const ariaBool = (value: boolean | undefined): 'true' | 'false' => {
  return value ? 'true' : 'false';
};

/**
 * Returns the proper aria-pressed attribute object with string literal value
 * @param isPressed - Boolean indicating if the element is pressed
 * @returns Object to spread into element props
 */
export const ariaPressed = (isPressed: boolean): { 'aria-pressed': 'true' | 'false' } => {
  return isPressed ? { 'aria-pressed': 'true' } : { 'aria-pressed': 'false' };
};

/**
 * Returns the proper aria-selected attribute object with string literal value
 * @param isSelected - Boolean indicating if the element is selected
 * @returns Object to spread into element props
 */
export const ariaSelected = (isSelected: boolean): { 'aria-selected': 'true' | 'false' } => {
  return isSelected ? { 'aria-selected': 'true' } : { 'aria-selected': 'false' };
};
