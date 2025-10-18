// src/utils/createPageUrl.js

/**
 * Converts a component name (PascalCase) to a route path (kebab-case).
 * @param {string} name - The component name (e.g., "AboutUs")
 * @returns {string} - The route path (e.g., "/about-us")
 */
export function createPageUrl(name) {
    if (!name || typeof name !== 'string') {
        throw new Error('createPageUrl: name must be a non-empty string');
    }

    // Special case: Home or Index component maps to root
    if (name.toLowerCase() === 'home' || name.toLowerCase() === 'index') {
        return '/';
    }

    // Convert PascalCase or camelCase to kebab-case
    const kebab = name
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // insert dash before capitals
        .replace(/[\s_]+/g, '-')                // replace spaces/underscores
        .toLowerCase();

    return `/${kebab}`;
}
