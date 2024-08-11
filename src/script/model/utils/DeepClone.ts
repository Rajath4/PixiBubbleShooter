import { BubbleSprite } from "../../components/bubbleLayout/model/BubbleSprite";
import { Tile } from "../../types/BubbleGridInterfaces";

function deepCloneMap(originalMap: Map<number, Tile[]>): Map<number, Tile[]> {
    const clonedMap = new Map<number, Tile[]>();

    originalMap.forEach((value, key) => {
        const clonedValue = value.map(tile => deepCloneTile(tile));
        clonedMap.set(key, clonedValue);
    });

    return clonedMap;
}

function deepCloneTile(tile: Tile): Tile {
    const clonedTile: Tile = { ...tile }; // Shallow clone the top-level properties

    // Deep clone the nested property
    // clonedTile.sprite = deepCloneBubbleSprite(tile.sprite);

    return clonedTile;
}

function deepCloneBubbleSprite(nestedProperty: BubbleSprite): BubbleSprite {
    // Implement deep clone logic for the nested property if needed
    // For example, you can use a similar approach to deepCloneTile
    return nestedProperty;
}


function deepClone(value: any, clonedObjects = new WeakMap()): any {
    if (value === null || typeof value !== 'object') {
        return value;
    }

    if (value instanceof Date) {
        return new Date(value.getTime());
    }

    if (clonedObjects.has(value)) {
        return clonedObjects.get(value);
    }

    if (value instanceof Array) {
        const arrayClone = value.map(item => deepClone(item, clonedObjects));
        clonedObjects.set(value, arrayClone);
        return arrayClone;
    }

    if (value instanceof Object) {
        const objectClone = Object.assign({}, value);
        clonedObjects.set(value, objectClone);
        for (const prop in objectClone) {
            if (objectClone.hasOwnProperty(prop)) {
                objectClone[prop] = deepClone(objectClone[prop], clonedObjects);
            }
        }
        return objectClone;
    }

    throw new Error("Unable to deep clone value");
}

export { deepClone, deepCloneMap };
