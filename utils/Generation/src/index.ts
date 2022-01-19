import fs from 'fs';
import {
    generateFinalizedMeta,
    LoadMeta,
    parseRares,
} from './Scripts/UpdateMeta';

const META_IN_DIR =
    'C:/Users/Cory/source/repos/CyberpunkApeExecutives/utils/Generation/src/Assets/InputMetadata';
const META_OUT_DIR =
    'C:/Users/Cory/source/repos/CyberpunkApeExecutives/utils/Generation/src/Assets/OutputMetadata';
const RARES_IN_DIR =
    'C:/Users/Cory/source/repos/CyberpunkApeExecutives/utils/Generation/src/Assets/Rares/Rares.csv';

const rares = parseRares(RARES_IN_DIR);
const meta = LoadMeta(META_IN_DIR);

const finalizedMeta = generateFinalizedMeta(
    meta,
    'https://cc_nftstore.mypinata.cloud/ipfs/QmW4EYTJxaDGipvdKf2Jr9UPiRnBzfYK1Nn9iL4ZZg76KG',
    'webp',
    rares,
    false,
    'https://cyberpunkapes.com/',
    'Cyberpunk Ape Executives',
    'Cyberpunk Ape Executives V2 by International Megadigital'
);
finalizedMeta.forEach((m, i) => {
    fs.writeFileSync(`${META_OUT_DIR}/${i + 1}`, JSON.stringify(m, null, 4));
});
