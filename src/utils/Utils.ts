export function normalizeString(str: string): string {
    return str.split("_").map(firstToUppercase).join(" ");
}

function firstToUppercase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}