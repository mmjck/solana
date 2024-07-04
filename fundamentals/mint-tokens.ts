import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { mintTo } from "@solana/spl-token";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import dotenv from "dotenv"
import path from 'path';

dotenv.config({ path: path.join(__dirname, "../.env") })

const connection = new Connection(clusterApiUrl("devnet"))



const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);


const user = getKeypairFromEnvironment("SECRET_KEY");




const tokenMintAccount = new PublicKey("3SKNcoX1do5DZKanJGxmKTAZxJ6T3JRcTQcDbHmNuk8C");

const recipientAssociatedTokenAccount = new PublicKey("2cFGSgWoXi5THhuQ1M9uhUa7iuogBkPLHQUQUQ6WFAmF");

const transactionSignature = await mintTo(
    connection,
    user,
    tokenMintAccount,
    recipientAssociatedTokenAccount,
    user,
    10 * MINOR_UNITS_PER_MAJOR_UNITS
)

const link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`✅ Success! Mint Token Transaction: ${link}`);