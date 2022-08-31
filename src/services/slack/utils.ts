export function truncate(str: string | undefined, len: number) {
  if (str === undefined) {
    return "No description found for Upright profile.";
  } else if (str && str.length > len) {
    return str.substring(0, len) + "...";
  } else {
    return str;
  }
}
