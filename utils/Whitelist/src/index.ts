import fs from 'fs';
import { parseWhitelist } from './Scripts/ParseWhitelist';

const whitelistDirPath = 'C:/Users/Cory/source/repos/CyberpunkApeExecutives/utils/Whitelist/src/Assets';
const whitelistOutPath = 'C:/Users/Cory/source/repos/CyberpunkApeExecutives/utils/Whitelist/src/CompiledWhitelist.json';
const whitelistDir = fs.readdirSync(whitelistDirPath, { withFileTypes: true });

const whitelistPaths = whitelistDir.map(file => `${whitelistDirPath}/${file.name}`);

parseWhitelist(whitelistPaths, 'https://mainnet.infura.io/v3/88f03c95e86b4e46b11163f869efe347').then((result) => {
    fs.writeFileSync(whitelistOutPath, JSON.stringify(result, null, 4));
})