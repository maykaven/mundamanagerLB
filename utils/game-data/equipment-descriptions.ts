/**
 * Equipment/wargear descriptions for tooltip display.
 * Sourced from LBcampaignBot/packages/shared/src/index.ts
 */
export const EQUIPMENT_DESCRIPTIONS: Record<string, string> = {
  // ==========================================
  // ARMOUR
  // ==========================================
  'Flak Armour': 'Common lightweight armour. Provides a 6+ save.',
  'Flak Armor': 'Common lightweight armour. Provides a 6+ save.',
  'Mesh Armour': 'Flexible mesh weave armour. Provides a 5+ save.',
  'Carapace Armour': 'Heavy armour that provides excellent protection. 4+ save.',
  'Carapace Armor': 'Heavy armour that provides excellent protection. 4+ save.',
  'Carapace - Light': 'Light carapace armour. Provides a 4+ save.',
  'Carapace - Heavy': 'Heavy carapace armour. Provides a 4+ save.',
  'Carapace - Archaeo': 'Archaeotech carapace armour. Provides a 4+ save.',
  'Ablative Overlay': 'Disposable armour layer that absorbs one hit. 6+ save, one-use.',
  'Furnace Plates': 'Crude but effective industrial armour. Provides a 6+ save.',
  'Armored Undersuit': 'Protective bodysuit worn under armour. 6+ save, improves existing armour by 1.',
  'Armoured Undersuit': 'Protective bodysuit worn under armour. 6+ save, improves existing armour by 1.',
  'Armoured Bodyglove': 'Van Saar protective bodysuit with rad-phage immunity. 6+ save, improves existing armour by 1.',
  'Armored Bodyglove': 'Van Saar protective bodysuit with rad-phage immunity. 6+ save, improves existing armour by 1.',
  'Hazard Suit': 'Protection against hazardous environments. 6+ save.',
  'Armourweave': 'Illegal lightweight armour. 5+ save.',
  'Draconic Scales': 'Exotic scaled armour. 3+ save.',
  'Flak - Hardened': 'Reinforced flak armour. 5+ save.',
  'Flak - Layered': 'Layered flak armour. 5+ save.',
  'Flak - Hardened Layered': 'Hardened layered flak armour. 4+ save.',
  'Gutterforged Cloak': 'Scrap metal cloak. Provides a 6+ save.',
  'Incombustible Hauberk': 'Fire-resistant armour. 5+ save.',
  'Mantle Malifica': 'Cursed protective garment. 4+ save.',
  'Plate Mail': 'Heavy metal armour. 5+ save.',
  'Platemail Armour': 'Heavy metal armour. 5+ save.',
  'Reflec Shroud': 'Energy-reflecting cloak. 6+ save.',
  'Crude Robes': 'Basic cloth robes. 6+ save.',
  'Flak Armour (Palanite)': 'Enforcer-grade flak armour. 5+ save.',
  'Layered Flak Armour': 'Layered flak armour. 5+ save, 4+ vs Blast/Template.',
  'Ceramite Shield': 'Heat-resistant combat shield. +2 save vs Melee, +1 save vs Ranged in front arc.',
  'Scrap Shield': 'Improvised shield. +2 save vs Melee, +1 save vs Ranged in front arc.',

  // Corpse Grinder Cult Masks
  "Butcher's Mask": '6+ save. Terrifying: enemies must pass Willpower to attack wearer.',
  "Cutter's Mask": '6+ save. Terrifying: enemies must pass Willpower to attack wearer.',
  "Skinner's Mask": '6+ save. Grants Fearsome Ferocity skill.',
  "Initiate's Mask": '6+ save. Basic cult mask.',

  // ==========================================
  // FIELD ARMOUR
  // ==========================================
  'Conversion Field': '5+ unmodifiable save. When saved, fighters within 3" hit by Flash.',
  'Displacer Field': '4+ unmodifiable save. When saved, teleport random direction equal to weapon Strength.',
  'Refractor Field': '5+ unmodifiable save on hit. If success, 2+ or field burns out.',
  'Hexagrammic Fetish': 'Warp-warding charm. 4+ ward save against psychic powers and Warp weapons.',
  'Mirror Aegis': 'Reflective force field. 4+ save. On natural 6, reflect attack back at attacker.',

  // ==========================================
  // PERSONAL EQUIPMENT
  // ==========================================
  'Bio-booster': 'First Injury roll, one less dice. If 1 die, roll 2 and discard one.',
  'Bio-scanner': '+1 to spot. Attackers can be spotted regardless of vision arc.',
  'Blind Snake Pouch': 'Gain Dodge skill. If already have Dodge, 5+ instead of 6+. 4+ vs Overwatch.',
  'Bomb Delivery Rats': 'Vermin trained to deliver explosive charges to enemy fighters.',
  'Booby Trap': 'Hidden explosive device placed during deployment.',
  'Cameleoline Cloak': '-1 to hit when targeted. -2 if partial cover or 12"+ away.',
  'Clip Harness': 'Allows safe descent from heights.',
  'Cred Sniffer': 'Locate hidden valuables. Post-battle credits bonus.',
  'Cult Icon': 'Inspires nearby cult fighters, boosting their Leadership.',
  'Drop Rig': 'Allows controlled descent from any height.',
  'Falsehood': '-1 to hit when targeted. -2 if partial cover or 12"+ away.',
  'Filter Plugs': '+1 to Toughness tests against gas weapons.',
  'Frenzon Collar': 'When Seriously Injured, 4+ to go Out of Action with Frenzon effects.',
  'Grav-chute': 'Allows controlled descent from any height.',
  'Grapnel Launcher': 'Allows climbing and traversing vertical surfaces.',
  'Guilder Cartograph': 'Re-roll one Exploration dice after each battle.',
  'Infra-sight': 'Ignore penalties for shooting through darkness or smoke.',
  'Infra-red Goggles': 'See heat signatures in darkness.',
  'Isotropic Fuel Rod': 'Once per battle, gain +2 Strength and +2 Toughness until end of round.',
  'Jump Booster': 'Personal thruster pack. Add 3" to Move (safe) or D3+3" (overcharge with risk).',
  'Malefic Artefact': 'Pass Int test to learn. Random effect: Viewer/Cutting Beam/Lifter/Holo/Weapon.',
  'Medicae Kit': 'Once per battle, can attempt to heal a Seriously Injured fighter.',
  'Medipack': 'Once per battle, can attempt to heal a Seriously Injured fighter.',
  'Photo-goggles': 'Ignore penalties for shooting through darkness or smoke.',
  'Photo-lumens': 'Powerful light source.',
  'Respirator': '+2 to Toughness tests against gas weapons.',
  'Rogue Doc': 'Post-battle medical assistance for injured fighters.',
  'Servo Harness': 'Powered exoskeleton providing enhanced strength. Makes Unwieldy weapons easier to use.',
  'Skinblade': 'Concealed blade, always counts as armed. If captured, may attempt escape on 5+.',
  'Stiletto Knife': 'A slender blade often coated with deadly toxins.',
  'Stimm-slug Stash': 'Once per battle: +2 Strength and +2 Toughness until end of round.',
  'Strip Kit': 'Tools for salvaging equipment from the field.',
  'Suspensor': 'Makes Unwieldy weapons easier to use.',
  'Web Solvent': 'Quickly dissolves webbing from Web weapons.',
  "Overseer's Chem-stash": 'Combat drugs with various effects.',
  'Focusing Crystal': 'Las weapon upgrade: +1 Strength.',

  // Specialist Equipment
  'Ammo Cache': 'Placed at battle start. +2 Ammo tests within 1". Ignore Scarce.',
  'Archaeotech Device': 'Pass Int test to learn. Random effect: Viewer/Cutting Beam/Lifter/Holo/Weapon.',
  'Dome Runner Map': 'Re-roll one Exploration dice after each battle.',
  'Second Best': 'Gain Dodge skill. If already have Dodge, 5+ instead of 6+. 4+ vs Overwatch.',
  'Threadneedle Worms': 'First Injury roll, one less dice. If 1 die, roll 2 and discard one.',
  'Lock Picks': 'Locate hidden valuables. Post-battle credits bonus.',

  // ==========================================
  // CHEMS
  // ==========================================
  'Ghast': 'Terrifying psychoactive compound.',
  'Frenzon': 'Combat drug causing berserker rage.',
  'Slaught': 'Combat stimulant enhancing reflexes.',
  'Scare Gas': 'Terrifying psychoactive compound.',

  // ==========================================
  // GRENADES
  // ==========================================
  'Anti-plant Grenade': 'Herbicidal grenade.',
  'Blasting Charges': 'Powerful demolition explosive.',
  'Choke Gas Grenade': 'Toxic gas grenade. Blast (3").',
  'Choke Gas Grenades': 'Toxic gas grenades. Blast (3").',
  'Demolition Charge': 'Powerful explosive charge for destroying structures.',
  'Demolition Charges': 'Powerful demolition explosives.',
  'Flares': 'Illumination flares.',
  'Frag Grenade': 'Standard fragmentation grenade. Blast (3").',
  'Frag Grenades': 'Standard fragmentation grenades. Blast (3").',
  'Gas Grenades': 'Grenades that release toxic gas. Blast (3").',
  'Gunk Bombs': 'Adhesive gunk grenades.',
  'Incendiary Charges': 'Fire-based explosive charges.',
  'Krak Grenade': 'Anti-armour shaped charge grenade.',
  'Krak Grenades': 'Anti-armour shaped charge grenades.',
  'Melta Bomb': 'Demolition charge with fusion core.',
  'Photon Flash Grenade': 'Blinding flash grenade. Blast (5").',
  'Photon Flash Grenades': 'Blinding flash grenades. Blast (5").',
  'Plasma Grenade': 'High-energy plasma grenade.',
  'Rad Grenade': 'Radioactive grenade.',
  'Scare Gas Grenade': 'Terror-inducing gas grenade. Blast (3").',
  'Scare Gas Grenades': 'Causes uncontrollable terror in victims. Blast (3").',
  'Smoke Grenade': 'Creates concealing smoke cloud. Blast (5").',
  'Smoke Grenades': 'Creates concealing smoke cloud. Blast (5").',
  'Stun Grenade': 'Non-lethal stun grenade. Blast (3").',
  'Stun Grenades': 'Non-lethal stun grenades. Blast (3").',
  'Psychotroke Grenades': 'Causes random mental effects on targets.',
  'Vortex Grenade': 'Devastating vortex weapon.',

  // ==========================================
  // BIONICS
  // ==========================================
  'Bionic Arm': 'Cybernetic arm replacement. Restores lost arm functionality.',
  'Bionic Leg': 'Cybernetic leg replacement. Restores lost leg functionality.',
  'Bionic Eye': 'Cybernetic eye replacement. Restores lost eye functionality.',
  'Bionic Spine': 'Cybernetic spine replacement.',
  'Bionic Lung': 'Cybernetic lung replacement.',
  'Cranial Cybernetics': 'Brain augmentation improving cognitive function.',
  'Lobo Chip': 'Pacification chip that suppresses free will.',
  'Mono-sight': 'Targeting augmentation for improved accuracy.',
  'Skeletal Enhancers': 'Reinforced skeleton for improved toughness.',
  'Cortex-Cogitator': 'Brain implant enhancing tactical awareness.',
  'Servitor Claw': 'Cybernetic claw replacement.',
  'Augmetic Fist': 'Cybernetic enhanced fist.',
  'Arc Hammer': 'Electrified power hammer.',
  'Arc Welder': 'Industrial arc welder.',

  // ==========================================
  // STATUS ITEMS
  // ==========================================
  'Exotic Furs': 'Luxurious furs displaying wealth and status.',
  'Gold-Plated Gun': 'Ostentatious weapon modification. No combat benefit.',
  'Opulent Jewellery': 'Expensive jewellery showing gang wealth.',
  'Uphive Raiments': 'Fine clothing from the upper hive.',
  'Master-Crafted Weapon': 'A weapon of exceptional quality.',

  // ==========================================
  // WEAPON ACCESSORIES
  // ==========================================
  'Gunshroud': 'Weapon silencer for pistols and basic weapons.',
  'Hotshot Las Pack': 'Overcharged power pack for las weapons. +1 Strength, loses Plentiful.',
  'Infra-Sight': 'Targeting sight for shooting in darkness.',
  'Las-Projector': 'Laser sight for improved accuracy.',
  'Laser sight': 'Laser targeting projector.',
  'Mono-Sight': 'Magnified targeting sight. +1 to hit at long range.',
  'Psi-grub': 'Psychic power amplifier for melee weapons.',
  'Telescopic Sight': 'Long-range targeting sight.',
  'Telescopic sight': 'Long-range targeting scope.',

  // ==========================================
  // ENFORCER EQUIPMENT
  // ==========================================
  'Magnacles': 'Restraint device for subduing suspects.',
  'Concussion Carbine': 'Stun weapon designed for crowd control.',
  'Shock Baton': 'Standard issue shock weapon.',
  'Sniper Rifle': 'Precision long-range rifle.',
  'Subjugation pattern grenade launcher': 'Enforcer-issue grenade launcher for crowd suppression.',
};
