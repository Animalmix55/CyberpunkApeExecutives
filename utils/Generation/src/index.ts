import axios from 'axios';
import fs from 'fs';
import { ERC721Meta } from './Models/Meta';
import {
    generateFinalizedMeta,
    LoadMeta,
    parseRares,
} from './Scripts/UpdateMeta';

const META_IN_DIR =
    'C:/Users/Cory/source/repos/CyberpunkApeExecutives/utils/Generation/src/Assets/InputMetadata';
const META_OUT_DIR =
    'C:/Users/Cory/source/repos/CyberpunkApeExecutives/utils/Generation/src/Assets/OutputMetadata';
const PLACEHOLDER_META_OUT_DIR =
    'C:/Users/Cory/source/repos/CyberpunkApeExecutives/utils/Generation/src/Assets/PlaceholderMetadata';
const RARES_IN_DIR =
    'C:/Users/Cory/source/repos/CyberpunkApeExecutives/utils/Generation/src/Assets/Rares/Rares.csv';
const IMAGE_IN_DIR =
    'C:/Users/Cory/source/repos/CyberpunkApeExecutives/utils/Generation/src/Assets/InputImages';
const RARE_IMAGE_IN_DIR =
    'C:/Users/Cory/source/repos/CyberpunkApeExecutives/utils/Generation/src/Assets/InputRares';
const IMAGE_OUT_DIR =
    'C:/Users/Cory/source/repos/CyberpunkApeExecutives/utils/Generation/src/Assets/OutputImages';

const FINALIZED_METADATA_DIR =
    'C:/Users/Cory/source/repos/CyberpunkApeExecutives/utils/Generation/src/Assets/FinalizedMetadata';

// // PLACEHOLDER STUFFS
// const meta = LoadMeta(META_IN_DIR);
// const { meta: placeholderMeta, idRareOverrides } = generateFinalizedMeta(
//     meta,
//     'https://cc_nftstore.mypinata.cloud/ipfs/QmW4EYTJxaDGipvdKf2Jr9UPiRnBzfYK1Nn9iL4ZZg76KG',
//     'webp',
//     [],
//     true,
//     'https://cyberpunkapes.com/',
//     'Cyberpunk Ape Executives',
//     'Cyberpunk Ape Executives V2 by International Megadigital'
// );
// placeholderMeta.forEach((pm, i) => {
//     fs.writeFileSync(
//         `${PLACEHOLDER_META_OUT_DIR}/${i + 1}`,
//         JSON.stringify(pm, null, 4)
//     );
// });

// // REAL METADATA STUFFS
// const rares = parseRares(RARES_IN_DIR);
// const meta = LoadMeta(META_IN_DIR);

// const { meta: finalizedMeta, idRareOverrides } = generateFinalizedMeta(
//     meta,
//     'https://cc_nftstore.mypinata.cloud/ipfs/QmW4EYTJxaDGipvdKf2Jr9UPiRnBzfYK1Nn9iL4ZZg76KG',
//     'webp',
//     rares,
//     false,
//     'https://cyberpunkapes.com/',
//     'Cyberpunk Ape Executives',
//     'Cyberpunk Ape Executives V2 by International Megadigital'
// );
// const metaWithPlaceholderImages = finalizedMeta.map((m, i) => {
//     const isRare = !!idRareOverrides[i];
//     let outputFileName = '';
//     if (isRare) {
//         const { fileName } = rares[idRareOverrides[i]];

//         const ext = fileName.split('.')[1];
//         outputFileName = `${i + 1}.${ext}`;

//         fs.copyFileSync(
//             `${RARE_IMAGE_IN_DIR}/${fileName}`,
//             `${IMAGE_OUT_DIR}/${outputFileName}`
//         );
//     } else {
//         outputFileName = `${i + 1}.png`;
//         fs.copyFileSync(
//             `${IMAGE_IN_DIR}/${outputFileName}`,
//             `${IMAGE_OUT_DIR}/${outputFileName}`
//         );
//     }

//     return { ...m, image: outputFileName } as ERC721Meta;
// });

// fs.writeFileSync(
//     `${META_OUT_DIR}/metaWithPlaceholderImages.json`,
//     JSON.stringify(metaWithPlaceholderImages, null, 4)
// );

// // WRITE OUT FINALIZED META
// const meta = JSON.parse(
//     fs
//         .readFileSync(`${META_OUT_DIR}/fixedMetaOutWithPlaceholderImages.json`)
//         .toString()
// ) as ERC721Meta[];

// const metaWithImages = meta.map((m) => ({
//     ...m,
//     image: `https://cc_nftstore.mypinata.cloud/ipfs/QmVeCidSpssAmCM8THrs6Qggk1cqkStMPewm9VEjQwWmvy/${m.image}`,
// }));

// metaWithImages.forEach((m, i) => {
//     fs.writeFileSync(
//         `${FINALIZED_METADATA_DIR}/${i + 1}`,
//         JSON.stringify(m, null, 4)
//     );
// });

const refreshMeta = async (): Promise<void> => {
    for (let i = 1; i <= 1112; i++) {
        try {
            // eslint-disable-next-line no-await-in-loop
            await axios.get(
                `https://api.opensea.io/api/v1/asset/0x1103ce6136306fedcc56fe7236b9e52f0c109d49/${i}/?force_update=true`,
                {
                    headers: {
                        'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
                    },
                }
            );
            console.log(`${i + 1} succeeded`);
        } catch (e) {
            console.log(`${i + 1} failed`);
            i -= 1;
        }
    }
};

refreshMeta();
