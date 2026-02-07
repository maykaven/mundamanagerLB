import { WargearItem } from '@/types/fighter';
import { ARMOR_SAVES } from '@/utils/game-data/armor-saves';

export interface ArmorSaveResult {
  /** Final calculated save value (e.g. 4 for 4+), or null if no armor */
  finalSave: number | null;
  /** Best base save before modifiers */
  baseSave: number | null;
  /** Human-readable breakdown for tooltip */
  breakdown: string;
}

// Build case-insensitive lookup map
const armorSavesCI = new Map<string, { armorSave?: number; saveModifier?: number }>();
for (const [key, value] of Object.entries(ARMOR_SAVES)) {
  armorSavesCI.set(key.toLowerCase(), value);
}

/**
 * Look up armor info with case-insensitive matching and house-specific suffix stripping.
 * DB stores names like "Flak armour" while our keys use "Flak Armour".
 */
function lookupArmorSave(name: string) {
  const lowerName = name.toLowerCase();
  // Direct match (case-insensitive)
  if (armorSavesCI.has(lowerName)) return armorSavesCI.get(lowerName)!;
  // Strip parenthesized suffix and try base name
  const baseMatch = lowerName.match(/^([a-z\s'-]+?)(?:\s*\(.*\))?$/);
  if (baseMatch) {
    const baseName = baseMatch[1].trim();
    if (armorSavesCI.has(baseName)) return armorSavesCI.get(baseName)!;
  }
  return null;
}

/**
 * Calculate a fighter's armor save from their equipped wargear.
 *
 * Logic:
 * 1. Find all wargear items that have armor save values (via ARMOR_SAVES lookup)
 * 2. Take the best (lowest) base save value
 * 3. Sum all save modifiers (e.g. bodyglove/undersuit gives -1)
 * 4. Apply modifiers to best base save
 * 5. Clamp result between 2+ and 6+
 *
 * Ported from LBcampaignBot/apps/web/src/app/gangs/[id]/page.tsx
 */
export function calculateArmorSave(wargear: WargearItem[]): ArmorSaveResult {
  if (!wargear || wargear.length === 0) {
    return { finalSave: null, baseSave: null, breakdown: 'No armour' };
  }

  let bestBaseSave: number | null = null;
  let bestBaseSaveSource: string | null = null;
  let saveModifierTotal = 0;
  const modifierSources: { source: string; value: number }[] = [];

  for (const item of wargear) {
    const armorInfo = lookupArmorSave(item.wargear_name);
    if (!armorInfo) continue;

    // Check for base armor save
    if (armorInfo.armorSave !== undefined) {
      if (bestBaseSave === null || armorInfo.armorSave < bestBaseSave) {
        bestBaseSave = armorInfo.armorSave;
        bestBaseSaveSource = item.wargear_name;
      }
    }

    // Check for save modifiers (e.g. bodyglove gives -1)
    if (armorInfo.saveModifier !== undefined) {
      saveModifierTotal += armorInfo.saveModifier;
      modifierSources.push({ source: item.wargear_name, value: armorInfo.saveModifier });
    }
  }

  // No armor found
  if (bestBaseSave === null && saveModifierTotal === 0) {
    return { finalSave: null, baseSave: null, breakdown: 'No armour' };
  }

  // If no base save but we have modifiers (e.g. bodyglove alone), use 6+ as base
  if (bestBaseSave === null && saveModifierTotal < 0) {
    bestBaseSave = 6;
    bestBaseSaveSource = modifierSources[0]?.source || 'Unknown';
  }

  // Calculate final save with modifiers, clamped between 2+ and 6+
  const finalSave = Math.max(2, Math.min(6, bestBaseSave! + saveModifierTotal));

  // Build breakdown string
  const parts: string[] = [];
  if (bestBaseSaveSource) {
    parts.push(`${bestBaseSaveSource}: ${bestBaseSave}+`);
  }
  for (const mod of modifierSources) {
    // Don't repeat the base source if it's also a modifier source with the same save
    if (mod.source === bestBaseSaveSource && modifierSources.length === 1 && lookupArmorSave(mod.source)?.armorSave !== undefined) {
      continue;
    }
    parts.push(`${mod.source}: ${mod.value > 0 ? '+' : ''}${mod.value}`);
  }

  const breakdown = parts.length > 0 ? parts.join(' / ') : 'No armour';

  return { finalSave, baseSave: bestBaseSave, breakdown };
}
