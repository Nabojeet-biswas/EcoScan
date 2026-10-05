export type BinType = 'recyclable' | 'organic' | 'non-recyclable' | 'special';

export interface WasteRule {
  name: string;
  category: BinType;
  aliases: string[];
  specialHandling?: string;
}

export const WASTE_RULES: WasteRule[] = [
  {
    name: 'Plastic Bottle',
    category: 'recyclable',
    aliases: ['plastic bottle', 'pet bottle', 'water bottle', 'soda bottle', 'beverage bottle']
  },
  {
    name: 'Aluminum Can',
    category: 'recyclable',
    aliases: ['aluminum can', 'aluminium can', 'soda can', 'beer can', 'metal can', 'tin can']
  },
  {
    name: 'Paper',
    category: 'recyclable',
    aliases: ['paper', 'newspaper', 'magazine', 'office paper', 'printer paper', 'mail', 'envelope']
  },
  {
    name: 'Cardboard',
    category: 'recyclable',
    aliases: ['cardboard', 'corrugated cardboard', 'box', 'shipping box', 'cereal box', 'carton']
  },
  {
    name: 'Glass Bottle',
    category: 'recyclable',
    aliases: ['glass bottle', 'glass jar', 'wine bottle', 'beer bottle', 'glass container']
  },
  {
    name: 'Banana Peel',
    category: 'organic',
    aliases: ['banana peel', 'fruit peel', 'vegetable scraps', 'fruit waste']
  },
  {
    name: 'Food Waste',
    category: 'organic',
    aliases: ['food waste', 'food scraps', 'leftovers', 'compost', 'organic waste', 'kitchen waste']
  },
  {
    name: 'Plastic Bag',
    category: 'non-recyclable',
    aliases: ['plastic bag', 'shopping bag', 'grocery bag', 'plastic film', 'ziploc', 'sandwich bag', 'wrap']
  },
  {
    name: 'Battery',
    category: 'special',
    aliases: ['battery', 'batteries', 'aa battery', 'aaa battery', 'lithium battery', 'button cell', 'rechargeable battery'],
    specialHandling: 'Take to e-waste collection point, battery drop-off at electronics stores, or household hazardous waste facility. Never place in regular trash or recycling.'
  },
  {
    name: 'Electronics',
    category: 'special',
    aliases: ['electronics', 'e-waste', 'phone', 'laptop', 'computer', 'tablet', 'cables', 'charger', 'headphones'],
    specialHandling: 'Take to certified e-waste recycler. Many retailers offer free recycling. Check local municipality for collection events.'
  },
  {
    name: 'Light Bulb',
    category: 'special',
    aliases: ['light bulb', 'fluorescent bulb', 'led bulb', 'cfl', 'tube light'],
    specialHandling: 'CFLs and fluorescent tubes contain mercury - take to hazardous waste facility. LEDs can often go to e-waste.'
  },
];

export function getBinForWaste(wasteName: string): BinType {
  const normalized = wasteName.toLowerCase().trim();
  
  for (const rule of WASTE_RULES) {
    if (rule.aliases.some(alias => normalized.includes(alias.toLowerCase()))) {
      return rule.category;
    }
    if (normalized.includes(rule.name.toLowerCase())) {
      return rule.category;
    }
  }
  
  return 'non-recyclable';
}

export function getSpecialHandling(wasteName: string): string | undefined {
  const normalized = wasteName.toLowerCase().trim();
  
  for (const rule of WASTE_RULES) {
    if (rule.aliases.some(alias => normalized.includes(alias.toLowerCase()))) {
      return rule.specialHandling;
    }
    if (normalized.includes(rule.name.toLowerCase())) {
      return rule.specialHandling;
    }
  }
  
  return undefined;
}

export function getBinColor(bin: BinType): string {
  switch (bin) {
    case 'recyclable': return '#3B82F6';
    case 'organic': return '#20C878';
    case 'non-recyclable': return '#EF4444';
    case 'special': return '#F59E0B';
  }
}

export function getBinLabel(bin: BinType): string {
  switch (bin) {
    case 'recyclable': return 'RECYCLABLE';
    case 'organic': return 'ORGANIC';
    case 'non-recyclable': return 'NON-RECYCLABLE';
    case 'special': return 'SPECIAL DISPOSAL';
  }
}

export function getBinDescription(bin: BinType): string {
  switch (bin) {
    case 'recyclable': return 'Plastic, paper, metal, glass';
    case 'organic': return 'Food & biodegradable waste';
    case 'non-recyclable': return 'Waste that cannot be recycled';
    case 'special': return 'Hazardous / e-waste collection';
  }
}

export function getBinIcon(bin: BinType): string {
  switch (bin) {
    case 'recyclable': return '♻️';
    case 'organic': return '🌱';
    case 'non-recyclable': return '🗑️';
    case 'special': return '⚠️';
  }
}