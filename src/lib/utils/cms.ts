import { get } from "svelte/store";
import { lang } from "$lib/stores/lang";

/**
 * STRIC CMS ENGINE: Forces all developers to source data from the dashboard.
 * NEVER HARDCODE TEXT IN UI COMPONENTS.
 */

interface Settings {
  [key: string]: any;
}

/**
 * Retrieves a localized string from the settings object.
 * If the key is missing in the dashboard, it returns an empty string to respect the admin's choice.
 *
 * @param settings The global settings object from the CMS
 * @param path The path to the setting (e.g., 'hero.title')
 * @returns The localized string or an empty string
 */
export function t(
  settings: Settings,
  path: string,
  forcedLang?: string,
): string {
  if (!settings) return "";

  const currentLang = forcedLang || get(lang);
  const otherLang = currentLang === "ar" ? "en" : "ar";
  const parts = path.split(".");

  // Navigate to the parent object
  let parent: any = settings;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (parent && typeof parent === "object" && part in parent) {
      parent = parent[part];
    } else {
      console.warn(
        `[CMS] Path parent not found: ${parts.slice(0, i + 1).join(".")}`,
      );
      return "";
    }
  }

  const lastPart = parts[parts.length - 1];

  if (parent && typeof parent === "object") {
    const localizedValue = parent[`${lastPart}_${currentLang}`];
    const otherValue = parent[`${lastPart}_${otherLang}`];

    // CRITICAL CHECK: If one language exists, the other MUST exist.
    if (localizedValue !== undefined || otherValue !== undefined) {
      if (localizedValue === undefined || otherValue === undefined) {
        console.error(
          `%c [CMS STRICT] Missing Translation! %c Key: "${path}" is missing its ${localizedValue === undefined ? currentLang : otherLang} counterpart. `,
          "background: #e31e24; color: white; font-weight: bold; padding: 2px 5px; border-radius: 3px;",
          "color: #e31e24; font-weight: bold;",
        );
      }
      return String(localizedValue ?? "");
    }

    // 2. Try literal version (for non-localized settings)
    const literalValue = parent[lastPart];
    if (literalValue !== undefined) {
      return typeof literalValue === "object" ? "" : String(literalValue ?? "");
    }
  }

  console.warn(`[CMS] Key not found: ${path}`);
  return "";
}

/**
 * Helper to get a raw value from settings without localization logic
 */
export function raw(settings: Settings, path: string): any {
  if (!settings) return undefined;
  const parts = path.split(".");
  let current = settings;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}
