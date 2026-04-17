import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
/**
 * Compose Tailwind class names with conflict resolution.
 * Standard shadcn utility — used by every UI component.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
//# sourceMappingURL=utils.js.map