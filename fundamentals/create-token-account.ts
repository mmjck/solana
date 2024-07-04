import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";



import dotenv from "dotenv"
import path from 'path';

dotenv.config({ path: path.join(__dirname, "../.env") })

const connection = new Connection(clusterApiUrl("devnet"))

const user = getKeypairFromEnvironment("SECRET_KEY")


console.log(
    `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
);
const tokenMintAccount = new PublicKey("3SKNcoX1do5DZKanJGxmKTAZxJ6T3JRcTQcDbHmNuk8C");


const recipient = user.publicKey;

const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    tokenMintAccount,
    recipient
);

console.log(`Token Account: ${tokenAccount.address.toBase58()}`);

const link = getExplorerLink(
    "address",
    tokenAccount.address.toBase58(),
    "devnet"
)

console.log(`✅ Created token Account: ${link}`);



