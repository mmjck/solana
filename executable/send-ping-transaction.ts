import {  getKeypairFromEnvironment } from "@solana-developers/helpers";
import * as web3 from "@solana/web3.js"

import dotenv from "dotenv"
import path from 'path';

dotenv.config({ path: path.join(__dirname, "../.env") })


const CLUSTER_NAME = "devnet";
const PING_PROGRAM_ADDRESS = new web3.PublicKey(
    "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa"
);
const PING_PROGRAM_DATA_ADDRESS = new web3.PublicKey(
    "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod"
);



const payer = getKeypairFromEnvironment("SECRET_KEY")
console.log(`🔑 Loaded keypair ${payer.publicKey.toBase58()}!`);


const connection = new web3.Connection(web3.clusterApiUrl(CLUSTER_NAME))
console.log(`⚡️ Connected to Solana ${CLUSTER_NAME} cluster!`);


connection.requestAirdrop(
    payer.publicKey, 1 * web3.LAMPORTS_PER_SOL,
)

const transaction = new web3.Transaction();
const programId = new web3.PublicKey(PING_PROGRAM_ADDRESS)
const pingProgramDataId = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS);

const instruction = new web3.TransactionInstruction({
    keys: [
        {
            pubkey: pingProgramDataId,
            isSigner: false,
            isWritable: true,
        },
    ],
    programId,
})

transaction.add(instruction)


const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  );
  
  console.log(`✅ Transaction completed! You can view your transaction on the Solana Explorer at:`);
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=${CLUSTER_NAME}`);