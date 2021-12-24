import fs from 'fs';
import { generateFinalizedMeta, LoadMeta } from "./Scripts/UpdateMeta"

const META_IN_DIR = "C:/Users/Cory/source/repos/CyberpunkApeExecutives/utils/Generation/src/Assets/GeneratedMeta"
const META_OUT_DIR = "C:/Users/Cory/source/repos/CyberpunkApeExecutives/utils/Generation/src/Assets/OutputMeta"

const meta = LoadMeta(META_IN_DIR);

const finalizedMeta = generateFinalizedMeta(meta, 'https://cc_nftstore.mypinata.cloud/ipfs/QmTxQKDBCbboeypSnQTUcFzuPY4wvZwvvFbbEQcb6Wc5ZX', 'png');
finalizedMeta.forEach((m, i) => {
    fs.writeFileSync(`${META_OUT_DIR}/${i+1}`, JSON.stringify(m, null, 4));
});