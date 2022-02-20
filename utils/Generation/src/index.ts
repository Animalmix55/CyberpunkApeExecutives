import axios from 'axios';
import fs from 'fs';
import Web3 from 'web3';
import BN from 'bn.js';
import { IMDStaking, Staked } from './Models/IMDStaking';
import { ERC721Meta } from './Models/Meta';
import {
    generateFinalizedMeta,
    LoadMeta,
    parseRares,
} from './Scripts/UpdateMeta';
import StakingABI from './Assets/IMDStakingAbi.json';

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

// const refreshMeta = async (): Promise<void> => {
//     for (let i = 1; i <= 1112; i++) {
//         try {
//             // eslint-disable-next-line no-await-in-loop
//             await axios.get(
//                 `https://api.opensea.io/api/v1/asset/0x1103ce6136306fedcc56fe7236b9e52f0c109d49/${i}/?force_update=true`,
//                 {
//                     headers: {
//                         'User-Agent':
//                             'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
//                     },
//                 }
//             );
//             console.log(`${i + 1} succeeded`);
//         } catch (e) {
//             console.log(`${i + 1} failed`);
//             i -= 1;
//         }
//     }
// };

// refreshMeta();

const getTotalRewards = async (): Promise<BN> => {
    const web3 = new Web3(
        'https://mainnet.infura.io/v3/81396dca1e0848fea22c248365f42873'
    );

    const contract: IMDStaking = new web3.eth.Contract(
        StakingABI as never,
        '0x8a793cc858eddd4e581726302a99e9f871aeeef5'
    ) as never;

    console.log('Fetching Events...');
    const events = (await contract.getPastEvents('Staked', {
        fromBlock: 14007525,
        toBlock: 'latest',
    })) as unknown as Staked[];
    console.log('Fetched Events...');

    const stakers = Array.from(
        events.reduce((prev, cur) => {
            const { returnValues } = cur;
            const { user } = returnValues;

            prev.add(user);
            return prev;
        }, new Set<string>())
    );

    console.log(`Fetching rewards for ${stakers.length} users...`);
    let totalRewards = new BN(0);
    for (let i = 0; i < stakers.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const dividend = await contract.methods
            .dividendOf(
                stakers[i],
                '0x1103ce6136306FEDcC56FE7236B9e52F0C109D49'
            )
            .call();

        totalRewards = totalRewards.add(new BN(dividend));
    }

    console.log(totalRewards.toString());

    return totalRewards;
};

getTotalRewards();
