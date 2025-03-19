import { ItemAbility } from "../types";
import buffInfo from "./buffs";
import delayedBuffs from "./delayedBuffs";
import { addHeal, customEmojis, dealDamage, numberToRoman } from "./functions";

type SkillPathCategory = "attack" | "defense" | "health" | "crit" | "mana" | "utility";

class SkillPath {
    _name: string;
    _description: string;
    _cost: number;
    _maxLevel: number;
    _category: SkillPathCategory;
    _passive: (level: number) => ItemAbility;
    _id: number;

    constructor(name: string, description: string, cost: number, maxLevel: number, category: SkillPathCategory, passive: (level: number) => ItemAbility, id: number) {
        this._name = name;
        this._description = description;
        this._cost = cost;
        this._maxLevel = maxLevel;
        this._category = category;
        this._passive = passive;
        this._id = id;
    }

    get name() {
        return this._name;
    };
    get description() {
        return this._description;
    };
    get cost() {
        return this._cost;
    };
    get maxLevel() {
        return this._maxLevel;
    };
    get category() {
        return this._category;
    };
    get passive() {
        return this._passive;
    };
    get id() {
        return this._id;
    };

    get emojiLabel(): string {
        switch (this._category) {
            case "attack":
                return customEmojis.atk;
            case "defense":
                return customEmojis.def;
            case "health":
                return customEmojis.hp;
            case "crit":
                return customEmojis.cr;
            case "mana":
                return customEmojis.mana;
            case "utility":
                return "🔧";
        };
    };

    fullName(level: number = 1, includeEmoji: boolean = false) {
        level ||= 1;
        return `${includeEmoji ? `${this.emojiLabel} ` : ""}${this._name} ${numberToRoman(level)}`;
    };
    desc(level: number = 1) {
        level ||= 1;
        return this._description.replace(/\+(\d+)/g, (match, num) => `+${num * level}`);
    };
};

export const skillTree: SkillPath[] = [
    // Attack
    new SkillPath("Blade Mastery", "Increases ATK by **+3%**.", 2, 10, "attack", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        const buff = Math.floor(myStatsFixed.atk * 0.03 * level);
        myStatsFixed.atk += buff;
        myStats.atk += buff;
    }, 0),
    new SkillPath("Arcane Mastery", "Increases MD by **+3%**.", 2, 10, "attack", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        const buff = Math.floor(myStatsFixed.md * 0.03 * level);
        myStatsFixed.md += buff;
        myStats.md += buff;
    }, 1),
    new SkillPath("Twin Fang", "Attacks have a **+1%** chance to strike twice.", 2, 10, "attack", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        const triggerChance = 0.01 * level;

        matchStats.on("attack", ({ trigger, caster, target, casterBuff, targetBuff, matchStats, options }) => {
            if (caster === myStats && Math.random() < triggerChance) {
                dealDamage(myStats, eStats, mybuff, ebuff, matchStats, notice, `✨ **${char.name}**`, { atkMultiplier: 1, magicDamage: true });
            };
        });
    }, 2),
    new SkillPath("Quick Draw", "First attack in battle deals an additional **+8%** damage.", 1, 10, "attack", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        const extraDamage = 0.08 * level;

        matchStats.on("attack", {
            maxUsage: 1,
            callback: ({ trigger, caster, target, casterBuff, targetBuff, matchStats, options }) => {
                if (caster === myStats && trigger.used < trigger.maxUsage) {
                    trigger.used++;
                    dealDamage(myStats, eStats, mybuff, ebuff, matchStats, notice, `✨ **${char.name}**`, { overwriteDamage: Math.floor(options.damage * extraDamage), magicDamage: true });
                };
            },
        });
    }, 3),

    // Defense
    new SkillPath("Iron Will", "Increases DEF by **+20** (bypasses DEF cap).", 2, 10, "defense", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        const buff = 20 * level;
        myStatsFixed.def += buff;
        myStats.def += buff;
        myStatsFixed.increase_defcap += buff;
        myStats.increase_defcap += buff;
    }, 4),
    new SkillPath("Magic Aegis", "Increases MR by **+20** (bypasses MR cap).", 2, 10, "defense", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        const buff = 20 * level;
        myStatsFixed.mr += buff;
        myStats.mr += buff;
        myStatsFixed.increase_mrcap += buff;
        myStats.increase_mrcap += buff;
    }, 5),

    // Health
    new SkillPath("Vital Surge", "Increases max HP by **+4%**.", 2, 10, "health", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        const buff = Math.floor(myStatsFixed.maxhp * 0.03 * level);
        myStatsFixed.maxhp += buff;
        myStatsFixed.hp += buff;
        myStats.maxhp += buff;
        myStats.hp += buff;
    }, 6),
    new SkillPath("Rejuvenation", "Heals **+0.5%** of max HP per round.", 2, 10, "health", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        const heal = Math.floor(myStats.maxhp * 0.005 * level);
        mybuff.hp.push(new buffInfo("+", heal, 9999));
    }, 7),
    new SkillPath("Second Wind", "Restores **+5%** of max HP after falling below **30%** HP for the first time.", 1, 10, "health", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        const heal = Math.floor(myStats.maxhp * 0.05 * level);
        const threshold = 0.3;

        if (myStats.hp / myStats.maxhp < threshold) {
            addHeal(myStats, eStats, myStats, mybuff, ebuff, matchStats, notice, ``, heal, {});
        } else {
            myStats.delayedBuffs.push(new delayedBuffs(0, function (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) {
                if (myStats.hp / myStats.maxhp < threshold) {
                    addHeal(myStats, eStats, myStats, mybuff, ebuff, matchStats, notice, ``, heal, {});
                    //@ts-ignore
                    this._used++;
                };
            }, 9999, 1));
        };
    }, 8),
    new SkillPath("Bloodlust", "Heals **+0.5%** of damage dealt.", 2, 10, "health", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        myStats.selfhealChance.push(1);
        myStats.selfheal.push(0.005 * level);
    }, 9),

    // Crit
    new SkillPath("Deadeye", "Increases crit rate by **+1.5%**.", 2, 10, "crit", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        const buff = 0.015 * level;
        myStatsFixed.cr += buff;
        myStats.cr += buff;
        if (myStatsFixed.cr > 1) myStatsFixed.cr = 1;
        if (myStats.cr > 1) myStats.cr = 1;
    }, 10),
    new SkillPath("Piercing Blows", "Increases crit damage by **+3%**.", 2, 10, "crit", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        const buff = 0.03 * level;
        myStatsFixed.cd += buff;
        myStats.cd += buff;
    }, 11),

    // Mana
    new SkillPath("Mana Reservoir", "Increases starting mana by **+1**.", 2, 10, "mana", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        const buff = 1 * level;
        myStatsFixed.sm += buff;
        myStats.sm += buff;
    }, 12),
    new SkillPath("Sorcerer's Will", "Increases mana generation by **+1**.", 2, 10, "mana", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        const buff = 1 * level;
        myStatsFixed.mg += buff;
        myStats.mg += buff;
    }, 13),
    new SkillPath("Mana Flow", "Increases Mana cap by **+5**.", 2, 10, "mana", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        const buff = 5 * level;
        myStatsFixed.mana += buff;
        myStats.mana += buff;
    }, 14),

    // Utility
    new SkillPath("Treasure Hunter", "Increases coin drops by **+15%**.", 2, 10, "utility", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        matchStats.lootm += 0.15 * level;
    }, 15),
    new SkillPath("Born to Grind", "Increases class xp by **+20%**.", 2, 10, "utility", (level) => (myStats, myStatsFixed, eStats, mybuff, ebuff, char, enemy, matchStats, notice, embed, user, ...list) => {
        matchStats.xpboost += 0.2 * level;
    }, 16),

];
