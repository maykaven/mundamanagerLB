/**
 * Armor save values for calculating fighter armor saves.
 * Maps armor/wargear names to their save value and optional modifier.
 *
 * armorSave: The base save value (lower is better, e.g. 4 = 4+ save)
 * saveModifier: Modifier to best existing save (negative improves, e.g. -1 makes 5+ into 4+)
 *
 * Note: House-specific names like "Mesh Armour (Escher)" are handled by
 * the lookupArmorSave() function in calculate-armor-save.ts which strips
 * the parenthesized suffix and matches the base name.
 *
 * Sourced from LBcampaignBot/packages/shared/src/index.ts
 */
export const ARMOR_SAVES: Record<string, { armorSave?: number; saveModifier?: number }> = {
  // Basic Armour
  'Flak Armour': { armorSave: 6 },
  'Flak Armor': { armorSave: 6 },
  'Mesh Armour': { armorSave: 5 },
  'Carapace Armour': { armorSave: 4 },
  'Carapace Armor': { armorSave: 4 },

  // N23 Armour Variants
  'Carapace - Light': { armorSave: 4 },
  'Carapace - Heavy': { armorSave: 4 },
  'Carapace - Archaeo': { armorSave: 4 },
  'Armourweave': { armorSave: 5 },
  'Flak - Hardened': { armorSave: 5 },
  'Flak - Layered': { armorSave: 5 },
  'Flak - Hardened Layered': { armorSave: 4 },
  'Plate Mail': { armorSave: 5 },
  'Platemail Armour': { armorSave: 5 },
  'Draconic Scales': { armorSave: 3 },
  'Mantle Malifica': { armorSave: 4 },

  // Misc Armour
  'Ablative Overlay': { armorSave: 6 },
  'Furnace Plates': { armorSave: 6 },
  'Gutterforged Cloak': { armorSave: 6 },
  'Hazard Suit': { armorSave: 6 },
  'Incombustible Hauberk': { armorSave: 5 },
  'Reflec Shroud': { armorSave: 6 },
  'Crude Robes': { armorSave: 6 },

  // Undersuits / Bodygloves (provide base save AND improve existing armour)
  'Armored Undersuit': { armorSave: 6, saveModifier: -1 },
  'Armoured Undersuit': { armorSave: 6, saveModifier: -1 },
  'Armored Bodyglove': { armorSave: 6, saveModifier: -1 },
  'Armoured Bodyglove': { armorSave: 6, saveModifier: -1 },

  // Enforcer Armour
  'Flak Armour (Palanite)': { armorSave: 5 },
  'Layered Flak Armour': { armorSave: 5 },

  // Corpse Grinder Cult Masks
  "Butcher's Mask": { armorSave: 6 },
  "Cutter's Mask": { armorSave: 6 },
  "Skinner's Mask": { armorSave: 6 },
  "Initiate's Mask": { armorSave: 6 },
};
