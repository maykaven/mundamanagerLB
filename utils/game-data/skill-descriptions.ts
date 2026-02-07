export const SKILL_DESCRIPTIONS: Record<string, string> = {
  // Agility
  'Catfall': 'When falling or jumping down, count vertical distance as half (rounded up). If not Seriously Injured or Out of Action, pass Initiative test to remain Standing instead of Prone and Pinned.',
  'Clamber': 'When climbing, distance moved is not halved. Always counts as climbing a ladder.',
  'Dodge': 'When suffering a wound from ranged or close combat, roll D6. On 6, attack is dodged. For Blast/Template weapons, a 6 lets you move up to 2" before checking if hit.',
  'Mighty Leap': 'When measuring gap distance to leap, ignore the first 2". Can leap gaps of 2" or less without Initiative test.',
  'Spring Up': 'If Prone and Pinned when activated, pass Initiative test to Stand Up for free. If failed, can still stand up for one action.',
  'Sprint': 'If making two Move (Simple) actions, the second can be a Sprint - move at double Movement characteristic.',

  // Brawn
  'Bull Charge': 'When making close combat attacks as part of a Charge, Melee weapons gain Knockback trait and +1 Strength.',
  'Bulging Biceps': 'Can wield Unwieldy weapons in one hand rather than two. Still takes up two weapon slots.',
  'Crushing Blow': 'Before rolling to hit, nominate one dice (not Sidearm) to make a Crushing Blow. If it hits, +1 Strength and +1 Damage.',
  'Headbutt': 'Headbutt (Free) when Standing and Engaged: Roll 2D6 vs enemy Toughness. If either equals or beats it, hit at S+2, Damage 2. If both fail, hit yourself at your own Strength, Damage 1.',
  'Hurl': 'Hurl (Basic) when Standing and Engaged: Target makes Initiative test. If failed, move them D3" any direction, become Prone and Pinned. If they hit anything, both take S3 D1 hit.',
  'Iron Jaw': 'Toughness is treated as 2 higher when attacked in close combat with a weapon with AP of -.',

  // Combat
  'Combat Master': 'Never suffers penalties to hit for interference. Can always grant assists regardless of how many enemies are engaged.',
  'Counter-attack': 'When making Reaction attacks, roll one additional Attack dice for each of the attacker\'s attacks that failed to hit.',
  'Disarm': 'Melee weapons gain Disarm trait. If weapon already has it, disarm on 5 or 6 instead of just 6.',
  'Parry': 'Can parry as if carrying a Parry weapon. If already have Parry weapon(s), can parry one additional attack.',
  'Rain of Blows': 'Fight action is Fight (Simple) instead of Fight (Basic). Can make two Fight actions when activated.',
  'Step Aside': 'When hit in close combat, pass Initiative test to make the attack miss. Once per enemy per round of combat.',

  // Cunning
  'Backstab': 'Melee weapons gain Backstab trait. If already have it, add +2 Strength instead of +1 when using the trait.',
  'Escape Artist': 'Add +2 to Initiative test when making Retreat action (natural 1 still fails). If Captured with a skinblade, +1 to escape roll.',
  'Evade': 'If targeted by ranged attack while Standing and Active and not in cover, -1 to hit modifier (-2 at Long range).',
  'Infiltrate': 'Instead of deploying normally, set up anywhere not visible to enemies and not within 6" of them before the first round.',
  'Lie Low': 'While Prone, enemies cannot target with ranged attacks unless within the weapon\'s Short range.',
  'Overwatch': 'If Standing and Active with Ready marker, can interrupt a visible enemy\'s action to make a Shoot (Basic) action. Lose Ready marker.',

  // Driving
  'Jink': 'Once per round when vehicle is hit, attempt a special Jink save. Roll D6, on 6+ the hit is ignored. Cannot be modified by AP.',
  'Expert Driver': 'Add +1 to Loss of Control test results.',
  'Heavy Foot': 'Once per round during Move or Ram action, increase Movement by D3". On natural 1, vehicle suffers Glancing Hit to Engine.',
  'Slalom': 'Once per round during Move action, make an additional turn of up to 45\u00b0 at any point.',
  'T-Bone': 'In Head-on Collision, add D3 to Front Toughness until collision is resolved.',
  'Running Repairs': 'When rolling natural 6 on Handling test to Restart while Stalled, also regain one lost Hull Point.',

  // Ferocity
  'Berserker': 'When making close combat attacks as part of a Charge, roll one additional Attack dice.',
  'Fearsome': 'Enemies must pass Willpower test before making a Charge that would result in attacks against this fighter. If failed, cannot move and activation ends.',
  'Impetuous': 'When consolidating after close combat, may move up to 4" instead of 2".',
  'Nerves of Steel': 'When hit by ranged attack, pass Cool test to choose not to become Prone and Pinned.',
  'True Grit': 'Roll one less Injury dice. For Damage 1 weapons, roll 2 dice and discard one before resolving.',
  'Unstoppable': 'Before Recovery test in End phase, roll D6. On 4+, discard one Flesh Wound. If no Flesh Wounds and roll 4+, roll extra Recovery dice and discard one.',

  // Leadership
  'Commanding Presence': 'When making group activation, include one more fighter than normal. Cannot be gained by vehicles.',
  'Inspirational': 'If friendly model within 6" fails Cool test, make Leadership test. If passed, the Cool test also counts as passed.',
  'Iron Will': 'Subtract 1 from Bottle check results while on battlefield and not Prone and Seriously Injured or Wrecked.',
  'Mentor': 'Make Leadership test when friendly model within 6" gains XP. If passed, they gain an additional XP.',
  'Overseer': 'Order (Double) when Standing and Active or Mobile: Pass Leadership test to let a friendly fighter within 6" immediately make two actions.',
  'Regroup': 'If Standing and Active or Mobile at end of activation, pass Leadership test to recover all friendly Broken models within 6".',

  // Savant
  'Ballistics Expert': 'When making Aim action, pass Intelligence test to gain additional +1 to hit modifier.',
  'Connected': 'Can make a Trade action in addition to other post-battle actions (can make two Trade actions total).',
  'Fixer': 'In Receive Rewards step, gang earns additional D3x10 credits if this model is not Captured or In Recovery.',
  'Medicae': 'Treat Wounds (Basic): Roll D6, on 3+ a friendly fighter within 1" regains a Wound or loses a Flesh Wound. Cannot be gained by vehicles.',
  'Munitioneer': 'Failed Ammo tests for this model or gang members within 6" can be re-rolled.',
  'Savvy Trader': 'When making Trade action, +1 to Availability roll for Rare/Illegal items. One item\'s cost may be reduced by 20 credits.',

  // Shooting
  'Fast Shot': 'Shoot and Fire All actions are (Simple) instead of (Basic), unless using Unwieldy weapons.',
  'Gunfighter': 'When using Twin Guns Blazing with two Sidearm weapons, no -1 penalty and can target different enemies.',
  'Hip Shooting': 'Vehicles: Move & Shoot is (Simple) instead of (Basic) unless using Unwieldy. Fighters: Run and Gun (Double) - move double Movement then attack with -1 to hit.',
  'Marksman': 'Not affected by Target Priority. On natural 6 to hit with non-Blast ranged weapon, score critical hit with doubled Damage.',
  'Precision Shot': 'On natural 6 to hit with non-Blast ranged weapon, shot hits exposed area and no armor save can be made.',
  'Trick Shot': 'No penalty for target being engaged or in partial cover. Full cover penalty reduced to -1 instead of -2.',

  // Tech (Van Saar specific)
  'Cold and Calculating': 'Once per round, may use Intelligence instead of Cool or Willpower for checks.',
  'Gadgeteer': 'Modify Plentiful weapons to gain Knockback, Pulverise, Rending, Shock, or +1 Rapid Fire.',
  'Mental Mastery': 'Immune to Insane condition. Can attempt to Disrupt Wyrd Powers as if a Psyker.',
  'Photonic Engineer': '+1 Strength to las weapons (gains Unstable). Re-roll failed Ammo on las without Unstable.',
  'Rad-phaged': 'Gas/Toxin attacks roll 2D6 discard highest. Rad-phage on 4+ removes a Flesh Wound instead.',
  'Weaponsmith': 'Weapons lose Scarce trait. Non-Scarce weapons gain Plentiful trait.',

  // Finesse (Escher specific)
  'Acrobatic': 'Ignore enemy fighters when moving or charging. Cross terrain up to 2" high without movement reduction.',
  'Combat Focus': 'Gain +1 to Willpower and Cool checks for each enemy fighter Out of Action or Seriously Injured.',
  'Combat Virtuoso': 'Chainswords, fighting knives, power knives, power swords, stiletto knives and stiletto swords gain Versatile trait.',
  'Hit and Run': 'After a Charge action, may make a free Retreat action before opponent makes reaction attacks.',
  'Lightning Reflexes': 'When Engaged by enemy, may attempt free Retreat action before enemy attacks. Once per round.',
  'Somersault': 'Basic action: Place fighter anywhere within 6" they can see. Does not count as moving for Unwieldy weapons.',

  // Muscle (Goliath specific)
  'Fists of Steel': 'Unarmed attacks count as Strength 2 higher than normal and inflict 2 damage.',
  'Iron Man': 'Toughness is not reduced by Flesh Wounds. Still goes Out of Action if Flesh Wounds equal Toughness.',
  'Immovable Stance': 'Tank (Double): +2 armor save (max 2+), cannot be moved by Hurl, Knockback, Drag, or Pinned until next activation.',
  'Naaargah!': 'May attempt a third action. Roll D6: on roll <= Toughness, perform action. On fail or 6, activation ends and fighter is Pinned.',
  'Unleash the Beast': 'Flex (Simple): All fighters in base contact must pass Strength check or be pushed D3" away.',
  'Walk It Off': 'When Seriously Injured, roll D6. On 5+, count as Flesh Wound instead and remain Standing.',

  // Piety (Cawdor specific)
  'Lord of Rats': 'Friendly Juves within 12" with line of sight gain +2 to Cool and Willpower checks. Rats within 3" are pushed away.',
  'Scavenger\'s Eye': 'Add +1 to dice rolls for loot, scrap, or harvested goods worth at the end of battles.',
  'Blazing Faith': 'When subject to Blaze, act normally instead of as determined by the condition. Ignores Insanity condition.',
  'Unshakable Conviction': 'May make reaction attacks while Seriously Injured. Cannot be Coup De Graced. Can Flock Together (Double) to move toward friendly Cawdor.',
  'Devotional Frenzy': 'Once per round: improve WS, Cool, Ld, Wil by D3 each until next activation. Suffer 1 automatic unsavable damage at end of activation.',
  'Restless Faith': 'During Choose Crew, may be taken out of Recovery and included in crew. If used, begins battle with a Flesh Wound.',

  // Palanite Drill (Enforcer specific)
  'Got Your Six': 'When a friendly fighter within 3" is attacked in melee, may immediately make a free Shoot (Basic) action at the attacker if not Engaged.',
  'Restraint Protocols': 'When making a Coup de Grace action, may instead capture the enemy fighter using Magnacles. Captured fighters can be traded or ransomed.',
  'Team Work': '+1 to hit rolls when a friendly Enforcer has already hit the same target this round.',
  'Threat Response': 'May make a free Charge (Double) reaction when an enemy fighter within 6" makes a ranged attack. Cannot react if Engaged or Pinned.',
  'Non-verbal Communication': 'At start of activation, may swap Ready marker with another friendly Enforcer within 6" and line of sight.',
  'Helmawr\'s Justice': 'When an enemy fighter is Seriously Injured by this fighter, gain +1 XP. Once per battle, may re-roll one failed hit or wound roll.',

  // Bravado (Orlock specific)
  'Big Brother': 'Friendly fighters within 6" may use this fighter\'s Cool characteristic for Nerve tests. Additionally, this fighter may re-roll failed Nerve tests.',
  'Bring it On!': 'When charged, this fighter gains +1 to hit rolls in the ensuing close combat. If the charging enemy is a Brute or has more Wounds than this fighter, gain +2 instead.',
  'Guilder Contacts': 'When buying equipment, add +2 to Rarity rolls. Once per post-battle, may purchase one item that is Out of Stock.',
  'King Hit': 'When this fighter charges, their first unarmed or melee attack that hits automatically wounds (no wound roll needed).',
  'Shotgun Savant': 'When firing a shotgun, may re-roll any Ammo dice. Shotguns gain +1 Strength at Short range.',
  'Steady Hands': 'This fighter ignores penalties for firing Unwieldy ranged weapons. Additionally, they may fire Heavy weapons after moving without penalty.',

  // Obfuscation (Delaque specific)
  'Faceless': 'Enemy fighters must pass a Willpower test to target this fighter with ranged attacks if there are other valid targets. Does not apply if this fighter is the closest target.',
  'Psi-touched': 'This fighter may attempt to Disrupt Wyrd Powers as if they were a Psyker. Additionally, they gain a 5+ save against Psychic attacks.',
  'Take Down': 'When making a Charge action, if all attacks hit, the target must pass a Strength test or be knocked Prone and Pinned.',
  'Rumour-monger': 'At the start of the battle, choose one enemy fighter. That fighter suffers -1 to all Leadership and Cool tests for the duration of the battle.',
  'Fake Out': 'Once per round, when this fighter is targeted by a ranged attack, they may force the attacker to re-roll all successful hit rolls.',
  'Doppelganger': 'This fighter may be set up anywhere on the battlefield more than 6" from enemy fighters, even if the scenario does not normally allow this. They count as having the Infiltrate skill.',
};
