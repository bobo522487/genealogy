/**
 * Strip clan surname from person names to match traditional Chinese genealogy conventions
 * e.g., "陈元英" -> "元英", "陈伯康" -> "伯康", "元英" -> "元英"
 */
export function stripSurname(name?: string, clanSurname: string = '陈'): string {
  if (!name) return '';
  const trimmed = name.trim();
  
  // Direct clan surname prefix match (e.g. "陈元英" -> "元英", "陈胡公" -> "胡公")
  if (clanSurname && trimmed.startsWith(clanSurname) && trimmed.length > clanSurname.length) {
    return trimmed.slice(clanSurname.length);
  }

  // Common Chinese single-character surname detection for 3-character names (e.g. "张三丰" -> "三丰")
  if (trimmed.length === 3 && /^[\u4e00-\u9fa5]{3}$/.test(trimmed)) {
    return trimmed.slice(1);
  }

  return trimmed;
}

export function formatGivenName(name?: string, clanSurname: string = '陈'): string {
  return stripSurname(name, clanSurname);
}
