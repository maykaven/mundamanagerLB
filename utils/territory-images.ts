/**
 * Maps territory names to their image filenames in /public/img/territories/
 * Images sourced from the LBcampaignBot project.
 */
export const TERRITORY_IMAGES: Record<string, string> = {
  // Dominion Territories
  'Settlement': 'settlement.png',
  'Old Ruins': 'Old_Ruins.png',
  'Workshop': 'Workshop.png',
  'Rogue Doc Shop': 'Rogue_Doc_Shop.png',
  'Collapsed Dome': 'Collapsed_Dome.png',
  'Promethium Cache': 'Promethium_Cache.png',
  'Sludge Sea': 'Sludge_Sea.png',
  'Wastes': 'Wastes.png',
  'Stinger Mould Sprawl': 'Stinger_Mould_Sprawl.png',
  'Synth Still': 'Synth_Still.png',
  'Narco Den': 'Narco_Den.png',
  'Slag Furnace': 'Slag_Furnace.png',
  'Smelting Works': 'Smelting_Works.png',
  'Mine Workings': 'Mine_Wrorkings.png',
  'Generatorium': 'Generatorium.png',
  'Fighting Pit': 'Fighting_Pit.png',
  'Gambling Den': 'Gambling_Den.png',
  'Drinking Hole': 'Drinking_Hole.png',
  'Tunnels': 'Tunnels.png',
  'Toll Crossing': 'Toll_Crossing.png',
  'Needle Ways': 'Needle_Ways.png',
  'Bone Shrine': 'Bone_Shrine.png',
  'Corpse Farm': 'Corpse_Farm.png',
  'Refuse Drift': 'Refuse_Drift.png',
  'Archaeotech Device': 'Archaeotech_Device.png',
  'Tech Bazaar': 'Tech_Bazaar.png',

  // Enforcer Territories
  'Precinct Fortress': 'Precinct_Fortress.png',
  'Evidence Lockup': 'Evidence_Lockup.png',
  'Informant Network': 'Informant_Network.png',
  'Execution Square': 'Execution_Square.png',

  // Corpse Grinder Cult Territories
  'Blood Temple of Khorne': 'Blood_Temple_of_Khorne.png',
  'Meat Processing Plant': 'Meat_Processing_Plant.png',
  'The Skull Pit': 'THe_Skull_Pit.png',
  "Butcher's Sanctum": 'Butcher\'s_Sanctum.png',

  // Genestealer Cult Territories
  'Cult Temple': 'Cult_Temple.png',
  'Brood Nest': 'Brood_Nest.png',
  'Cult Mining Operation': 'Cult_Mining_Operation.png',
  'Psychic Communion Node': 'Psychic_Communion_Node.png',

  // Chaos Cult Territories
  'Dark Shrine of the Ruinous Powers': 'Dark_Shrine_of_the_Ruinous_Powers.png',
  'The Corruption Pit': 'The_Corruption_Pit.png',
  'Forbidden Library': 'Forbidden_Library.png',
  'Sacrificial Chamber': 'Sacrificial_Chamber.png',

  // Outcast Territories
  'Underhive Refuge': 'Underhive_Refuge.png',
  'Black Market Den': 'Black_Market_Den.png',
  'Scavenger Camp': 'Scavenger_Camp.png',
  "Smuggler's Tunnel Network": 'Smuggler\'s_Tunnel_Network.png',

  // Custom Territories
  'Plasma Conduit Junction': 'Plasma_Conduit_Junction.png',
  'Rattling Warrens': 'Rattling_Warrens.png',
  'The Pit of Chains': 'The_Pit_of_Chains.png',
  'Chem Gardens': 'Chem_Gardens.png',
  'Shrine of The Emperor Defiant': 'Shrine_of_The_Emperor_Defiant.png',
  "Scrap Merchant's Yard": 'Scrap_Merchants_Yard.png',
  'The Underhive Arena': 'The_Underhive_Arena.png',
  'Hidden Archaeotech Cache': 'Hidden_Archaeotech_Cache.png',
  'Mutant Quarter': 'Mutant_Quarter.png',
  'Corpse Starch Processing Facility': 'Corpse_Starch_Processing_Facility.png',
  'Vox Relay Station': 'Vox_Relay_Station.png',
  'Sump Beast Lair': 'Sump_Beast_Lair.png',
};

/**
 * Get the image path for a territory by name.
 * Falls back to null if no image is found.
 */
export function getTerritoryImage(territoryName: string): string | null {
  const filename = TERRITORY_IMAGES[territoryName];
  if (filename) {
    return `/img/territories/${filename}`;
  }
  return null;
}
