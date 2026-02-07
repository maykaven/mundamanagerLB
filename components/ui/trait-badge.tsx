'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { WEAPON_TRAITS } from '@/utils/game-data/weapon-traits';
import { SKILL_DESCRIPTIONS } from '@/utils/game-data/skill-descriptions';
import { EQUIPMENT_DESCRIPTIONS } from '@/utils/game-data/equipment-descriptions';

interface TraitBadgeProps {
  trait: string;
  type?: 'weapon' | 'skill' | 'equipment';
  size?: 'sm' | 'md';
}

/**
 * Build a case-insensitive lookup map from a Record.
 */
function buildCaseInsensitiveMap(source: Record<string, string>): Map<string, string> {
  const map = new Map<string, string>();
  for (const [key, value] of Object.entries(source)) {
    map.set(key.toLowerCase(), value);
  }
  return map;
}

const weaponTraitsCI = buildCaseInsensitiveMap(WEAPON_TRAITS);
const skillDescriptionsCI = buildCaseInsensitiveMap(SKILL_DESCRIPTIONS);
const equipmentDescriptionsCI = buildCaseInsensitiveMap(EQUIPMENT_DESCRIPTIONS);

/**
 * Look up a description for a trait/skill/equipment, handling parameterized traits like "Blast (3")" or "Rapid Fire (2)".
 * Uses case-insensitive matching since DB names may differ in casing from lookup keys.
 */
function getDescription(name: string, type: 'weapon' | 'skill' | 'equipment'): string | null {
  const lookup = type === 'weapon' ? weaponTraitsCI : type === 'skill' ? skillDescriptionsCI : equipmentDescriptionsCI;
  const lowerName = name.toLowerCase();

  // Direct match (case-insensitive)
  if (lookup.has(lowerName)) {
    return lookup.get(lowerName)!;
  }

  // Handle parameterized traits - extract base name
  // e.g., "Rapid Fire (2)" → "Rapid Fire"
  const baseMatch = lowerName.match(/^([a-z\s'-]+?)(?:\s*\(.*\))?$/);
  if (baseMatch) {
    const baseName = baseMatch[1].trim();
    if (lookup.has(baseName)) {
      return lookup.get(baseName)!;
    }
  }

  return null;
}

export function TraitBadge({ trait, type = 'weapon', size = 'sm' }: TraitBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0, alignment: 'center' as 'center' | 'left' | 'right' });
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const description = getDescription(trait, type);
  const hasDescription = description !== null;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
  };

  const handleMouseEnter = () => {
    if (badgeRef.current && hasDescription) {
      const rect = badgeRef.current.getBoundingClientRect();
      const tooltipWidth = 256;
      const centerX = rect.left + rect.width / 2;

      let alignment: 'center' | 'left' | 'right' = 'center';
      if (centerX - tooltipWidth / 2 < 8) {
        alignment = 'left';
      } else if (centerX + tooltipWidth / 2 > window.innerWidth - 8) {
        alignment = 'right';
      }

      setTooltipPos({
        top: rect.top - 8,
        left: centerX,
        alignment,
      });
      setShowTooltip(true);
    }
  };

  const getTooltipTransform = () => {
    switch (tooltipPos.alignment) {
      case 'left':
        return 'translate(0, -100%)';
      case 'right':
        return 'translate(-100%, -100%)';
      default:
        return 'translate(-50%, -100%)';
    }
  };

  const getArrowClass = () => {
    switch (tooltipPos.alignment) {
      case 'left':
        return 'left-0';
      case 'right':
        return 'right-0';
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  const tooltip = showTooltip && hasDescription && mounted ? createPortal(
    <div
      className="fixed z-[9999] w-64 p-2 bg-popover border border-primary rounded shadow-lg text-xs text-popover-foreground leading-relaxed pointer-events-none"
      style={{
        top: tooltipPos.top,
        left: tooltipPos.left,
        transform: getTooltipTransform(),
      }}
    >
      <div className="font-semibold text-primary mb-1">{trait}</div>
      <div className="text-muted-foreground">{description}</div>
      <div className={`absolute top-full ${getArrowClass()} -mt-px`}>
        <div className="border-8 border-transparent border-t-primary"></div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <span className="relative inline-block">
      <span
        ref={badgeRef}
        className={`
          ${sizeClasses[size]}
          inline-block rounded
          ${hasDescription
            ? 'bg-accent text-accent-foreground cursor-help border border-primary/50 hover:bg-primary hover:text-primary-foreground hover:border-primary'
            : 'bg-muted text-muted-foreground border border-border/30'
          }
          transition-colors
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {trait}
      </span>
      {tooltip}
    </span>
  );
}

interface TraitBadgeListProps {
  traits: string[];
  type?: 'weapon' | 'skill' | 'equipment';
  size?: 'sm' | 'md';
  className?: string;
}

export function TraitBadgeList({ traits, type = 'weapon', size = 'sm', className = '' }: TraitBadgeListProps) {
  if (!traits || traits.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {traits.map((trait, index) => (
        <TraitBadge key={`${trait}-${index}`} trait={trait} type={type} size={size} />
      ))}
    </div>
  );
}
