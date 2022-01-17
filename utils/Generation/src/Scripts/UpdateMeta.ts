/* eslint-disable import/prefer-default-export */

import fs from 'fs';
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
    placeholder?: boolean,
    externalUrlOverride?: string
): ERC721Meta[] => {
    if (placeholder) {
        return meta.map((m) => ({
            name: m.name,
            description: m.description,
            attributes: [],
            image: `${baseURL}`,
            external_url: externalUrlOverride,
        }));
    }

    return meta.map((m, i) => ({
        ...m,
        image: `${baseURL}/${i + 1}.${imageExt}`,
        ...(externalUrlOverride && { external_url: externalUrlOverride }),
    }));
};
