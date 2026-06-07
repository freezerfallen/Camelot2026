// Extreme Floor Item Drops Mapping
// Maps floors 301-330 to their respective unique item IDs and types
// Now supports weapons, armor, rings, and runes

interface ExtremeItemDrop {
    itemId: number;
    itemType: "weapon" | "armor" | "ring" | "rune";
    // Optional material configuration for weapons
    ascensionMaterialId?: number;  // Specific ascension material ID (optional)
    ascensionAmount?: number;      // Custom ascension material amount (optional)
    craftingAmount?: number;       // Custom crafting material amount (optional)
}

export const extremeFloorItemMapping: Record<number, ExtremeItemDrop> = {
    301: { itemId: 796, itemType: "rune" },  // Ciel: Ciel's Blessing
    302: { itemId: 797, itemType: "weapon", ascensionMaterialId: 798, ascensionAmount: 240, craftingAmount: 180 }, // McBurn: Angbar
    303: { itemId: 799, itemType: "weapon", ascensionMaterialId: 804, ascensionAmount: 240, craftingAmount: 180 }, // Father: The Flawed
    304: { itemId: 292, itemType: "weapon", ascensionMaterialId: undefined, ascensionAmount: 240, craftingAmount: 180 },
    305: { itemId: 800, itemType: "weapon" },  // Atares: Kamish's Wrath
    306: { itemId: 801, itemType: "weapon" },  // NereID: Thalokorn
    307: { itemId: 802, itemType: "weapon", ascensionMaterialId: 803, ascensionAmount: 240, craftingAmount: 180 },  // Ryomen Sukuna: Kamutoke
    308: { itemId: 296, itemType: "weapon" },  // (next available weapon)
    309: { itemId: 297, itemType: "weapon" },  // (next available weapon)
    310: { itemId: 298, itemType: "weapon" },  // (next available weapon)
    311: { itemId: 837, itemType: "armor" },  // Oktavia von Seckendorff: Marguerite Noire Vambrace
    312: { itemId: 836, itemType: "armor" },  // Ophelia: Marguerite Noire Robe
    313: { itemId: 838, itemType: "armor" },  // Candeloro: Marguerite Noire Boots
    314: { itemId: 835, itemType: "armor" },  // Homulily: Marguerite Noire Hat
    315: { itemId: 839, itemType: "rune" },  // Kriemhild Gretchen: Soul Gem
    316: { itemId: 304, itemType: "weapon" },  // (next available weapon)
    317: { itemId: 305, itemType: "weapon" },  // (next available weapon)
    318: { itemId: 306, itemType: "weapon" },  // (next available weapon)
    319: { itemId: 307, itemType: "weapon" },  // (next available weapon)
    320: { itemId: 308, itemType: "weapon" },  // (next available weapon)
    321: { itemId: 309, itemType: "weapon" },  // (next available weapon)
    322: { itemId: 310, itemType: "weapon" },  // (next available weapon)
    323: { itemId: 311, itemType: "weapon" },  // (next available weapon)
    324: { itemId: 312, itemType: "weapon" },  // (next available weapon)
    325: { itemId: 313, itemType: "weapon" },  // (next available weapon)
    326: { itemId: 314, itemType: "weapon" },  // (next available weapon)
    327: { itemId: 315, itemType: "weapon" },  // (next available weapon)
    328: { itemId: 316, itemType: "weapon" },  // (next available weapon)
    329: { itemId: 317, itemType: "weapon" },  // (next available weapon)
    330: { itemId: 318, itemType: "weapon" }   // (next available weapon)
};

// Function to check if a floor has an extreme item drop
export function hasExtremeItemDrop(floor: number): boolean {
    return floor >= 301 && floor <= 330 && floor in extremeFloorItemMapping;
}

// Function to get the item drop info for a specific floor
export function getExtremeItemDrop(floor: number): ExtremeItemDrop | null {
    return hasExtremeItemDrop(floor) ? extremeFloorItemMapping[floor] : null;
}

// Legacy functions for backward compatibility
export function hasExtremeWeaponDrop(floor: number): boolean {
    return hasExtremeItemDrop(floor) && extremeFloorItemMapping[floor]?.itemType === "weapon";
}

export function getExtremeWeaponId(floor: number): number | null {
    const drop = getExtremeItemDrop(floor);
    return drop && drop.itemType === "weapon" ? drop.itemId : null;
}

// Function to check if a weapon ID is from extreme dungeon drops
export function isExtremeWeapon(itemId: number): boolean {
    return Object.values(extremeFloorItemMapping)
        .some(drop => drop.itemType === "weapon" && drop.itemId === itemId);
}

// Function to get material configuration for a specific weapon ID
export function getExtremeWeaponConfig(itemId: number): ExtremeItemDrop | null {
    const drop = Object.values(extremeFloorItemMapping)
        .find(drop => drop.itemType === "weapon" && drop.itemId === itemId);
    return drop || null;
}
