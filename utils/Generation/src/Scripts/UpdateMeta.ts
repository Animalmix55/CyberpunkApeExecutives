/* eslint-disable no-continue */
/* eslint-disable import/prefer-default-export */

import fs from 'fs';
import crypto from 'crypto';
import { ERC721Meta } from '../Models/Meta';

export const LoadMeta = (folder: string) => {
    const files = fs.readdirSync(folder, { withFileTypes: true });
    const result = [] as ERC721Meta[];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const tokenId = Number(file.name.split('.')[0]);
        if (Number.isNaN(tokenId)) process.abort();
        // eslint-disable-next-line no-continue
        if (tokenId <= 0) continue;

        const fileData = fs.readFileSync(`${folder}/${file.name}`).toString();

        try {
            const tokenMeta = JSON.parse(fileData) as ERC721Meta;
            result[tokenId - 1] = tokenMeta;
        } catch (e) {
            console.error(e, fileData, file);
            process.exit(1);
        }
    }

    return result;
};

export const cleanseMetadata = (meta: ERC721Meta[]) => {
    return meta.map((m): ERC721Meta => {
        const attributes = m.attributes
            .filter((a) => !a.trait_type.toLowerCase().includes('- x'))
            .filter((a) => !a.value.match(/^[a-z]/))
            .filter((a) => !a.value.includes('_'));

        return { ...m, attributes };
    });
};

export const addSpecialCodes = (meta: ERC721Meta[]) => {
    return meta.map((m): ERC721Meta => {
        const attributes = [...m.attributes];
        attributes.push({
            trait_type: 'Secret International Megadigital Code',
            value: String(crypto.randomInt(501)),
            display_type: 'number',
        });
        attributes.push({
            trait_type: 'Super Secret IMD Code',
            value: String(crypto.randomInt(3000)),
            display_type: 'number',
        });

        return { ...m, attributes };
    });
};

// export const spliceInRares = (
//     rares: ERC721Meta[],
//     normals: ERC721Meta[]
// ): ERC721Meta[] => {
//     const numRares = rares.length;
//     const collectionSize = normals.length;
//     let lastIndex = 0;

//     const placedIds: number[] = [];
//     const resultantMeta = [...normals];

//     rares.forEach((rare, i) => {
//         const step = Math.floor(
//             (collectionSize - lastIndex + 1) / (numRares - i)
//         );
//         if (step === 0) throw new Error('Step of 0');
//         const targetIndex =
//             lastIndex + crypto.randomInt(Math.max(1, step - 10), step + 1);
//         if (targetIndex >= collectionSize - 1) throw new Error('Out of bounds');

//         resultantMeta[targetIndex] = rare;
//         placedIds.push(targetIndex + 1);
//         lastIndex = targetIndex;
//     });

//     console.log('Placed rares at: ', JSON.stringify(placedIds));
//     return resultantMeta;
// };

export const spliceInRares = (
    rares: ERC721Meta[],
    normals: ERC721Meta[]
): ERC721Meta[] => {
    const remainingRares = [...rares];
    const output = [...normals];
    const placedIds: number[] = [];

    while (remainingRares.length > 0) {
        const index = crypto.randomInt(normals.length);
        if (placedIds.some((pid) => Math.abs(pid - index + 1) <= 10)) continue;

        output[index] = remainingRares[remainingRares.length - 1];
        remainingRares.pop();
        placedIds.push(index + 1);
    }

    console.log(
        'Placed rares at: ',
        JSON.stringify(placedIds.sort((a, b) => a - b))
    );

    return output;
};

export const parseRares = (path: string): ERC721Meta[] => {
    const file = fs.readFileSync(path).toString();
    const lines = file.split('\r\n');
    const traits = lines[0].split(',').slice(1);

    const rares = lines.slice(1).map((line): ERC721Meta => {
        const attributeCells = line
            .split(',')
            .map((l) => l.trim())
            .slice(1);

        const attributes = attributeCells.map(
            (a, i): ERC721Meta['attributes'][number] => ({
                trait_type: traits[i],
                value: a,
            })
        );

        return {
            name: '',
            attributes,
            image: 'placeholder',
        };
    });

    return rares;
};

/**
 * Adds the url and hides data (if placeholder) to the given meta.
 * @param meta the source metadata
 * @param baseURL the base uri of the meta's images (no trailing slash)
 * @param imageExt the ext of the images (without the period)
 * @param placeholder if the attributes should be hidden
 * @returns new meta
 */
export const generateFinalizedMeta = (
    meta: ERC721Meta[],
    baseURL: string,
    imageExt: string,
    rares: ERC721Meta[],
    placeholder?: boolean,
    externalUrlOverride?: string,
    nameOverride?: string,
    descriptionOverride?: string
): ERC721Meta[] => {
    if (placeholder) {
        return meta.map((m, i) => ({
            name: nameOverride ? `${nameOverride} #${i + 1}` : m.name,
            description: descriptionOverride ?? m.description,
            attributes: [],
            image: `${baseURL}`,
            external_url: externalUrlOverride,
        }));
    }

    return spliceInRares(rares, addSpecialCodes(cleanseMetadata(meta))).map(
        (m, i) => ({
            ...m,
            name: nameOverride ? `${nameOverride} #${i + 1}` : m.name,
            description: descriptionOverride ?? m.description,
            image: `${baseURL}/${i + 1}.${imageExt}`,
            ...(externalUrlOverride && { external_url: externalUrlOverride }),
        })
    );
};
