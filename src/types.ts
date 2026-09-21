import { type Ref } from 'vue';

export interface CobblemonBaseStats {
    attack: number;
    defence: number;
    hp: number;
    special_attack: number;
    special_defence: number;
    speed: number;
}

export interface CobblemonBehaviourEntityInteract {
    avoidedByPhantom?: boolean;
}

export interface CobblemonBehaviourHerd {
    maxSize: number;
    toleratedLeaders: {
        pokemon: string;
        tier: number;
    }[];
}

export interface CobblemonBehaviourMoving {
    canLook: boolean;
    fly: {
        canFly: boolean;
    };
    swim: {
        avoidWater: boolean;
    };
}

export interface CobblemonBehaviourResting {
    canSleep: boolean;
    drowsyChance: number;
    light: string;
    rouseChance: number;
    times: string[];
}

export interface CobblemonEvolution {
    consumeHeldItem: boolean;
    id: string;
    learnableMoves: string[];
    requirements: {
        minLevel: number;
        variant: string;
    };
    result: string;
    variant: string;
}

export interface CobblemonData {
    abilities: string[];
    aspects: any[];
    baseExperienceYield: number;
    baseFriendship: number;
    baseScale: number;
    baseStats: CobblemonBaseStats;
    behaviour: {
        entityInteract: CobblemonBehaviourEntityInteract;
        herd: CobblemonBehaviourHerd;
        moving: CobblemonBehaviourMoving;
        resting: CobblemonBehaviourResting;
    };
    catchRate: number;
    drops: {
        amount: number;
        entries: {
            item: string;
            quantityRange?: string;
            percentage?: number;
        };
    };
    eggCycles: number;
    eggGroups: string[];
    evYield: CobblemonBaseStats;
    evolutions: CobblemonEvolution[];
    experienceGroup: string;
    height: number;
    hitbox: {
        fixed: boolean;
        height: number;
        width: number;
    };
    implemented: boolean;
    labels: string[];
    maleRatio: string;
    moves: string[];
    name: string;
    nationalPokedexNumber: number;
    pokedex: string[];
    primaryType: string;
    secondaryType?: string;
    weight: number;
    shoulderMountable?: boolean;
}

export interface InputOptions {
    registerAt?: string;
    type?: 'text' | 'number';
}

export interface FormContext {
    register: (field: any) => void;
    unregister: (field: any) => void;
}

export interface FormFieldData {
    key: string;
    updated: boolean;
    value: any;
}
