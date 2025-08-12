export function formatToDollars(cents) {
    return `$${(cents / 100).toFixed(2)}`;
}