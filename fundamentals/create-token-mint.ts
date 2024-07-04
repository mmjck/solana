

import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { createMint } from "@solana/spl-token";
import { Connection, clusterApiUrl } from "@solana/web3.js";


import dotenv from "dotenv"
import path from 'path';

dotenv.config({ path: path.join(__dirname, "../.env")})

const connection = new Connection(clusterApiUrl("devnet"))

const user = getKeypairFromEnvironment("SECRET_KEY")


console.log(
    `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
  );


const tokenMint = await createMint(connection, user, user.publicKey, null, 2)
const link = getExplorerLink("address", tokenMint.toString(), "devnet")

console.log(`✅ Finished! Created token mint: ${link}`);
