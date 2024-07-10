import {
    Keypair,
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    TransactionInstruction,
    sendAndConfirmTransaction,
    Transaction
} from "@solana/web3.js"

import * as fs from "fs";
import * as path from "path";

const PROGRAM_KEYPAIR_PATH = path.join(
    path.resolve(__dirname, '../../dist/program'),
    'hello_solana-keypair.json'
);


const URL = "'https://api.devnet.solana.com'"
const CONFIRMED = "confirmed"

async function main() {
    console.log("Launching client...");

    let connection: Connection = new Connection(URL, CONFIRMED);

    const secretKeyString = await fs.readFile(PROGRAM_KEYPAIR_PATH, { encoding: 'utf8' });
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const programKeypair = Keypair.fromSecretKey(secretKey);
    let programId: PublicKey = programKeypair.publicKey;


    const triggerKeyPair = Keypair.generate()

    const airdropRequest = await connection.requestAirdrop(
        triggerKeyPair.publicKey,
        LAMPORTS_PER_SOL
    )

    await connection.confirmTransaction(airdropRequest)


    console.log('--Pinging Program ', programId.toBase58());

    const instruction = new TransactionInstruction({
        keys: [{pubkey: triggerKeyPair.publicKey, isSigner: false, isWritable: true}],
        programId,
        data: Buffer.alloc[0]
    })

    await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [triggerKeyPair],
      );

}

main().then(
    () => process.exit(),
    err => {
      console.error(err);
      process.exit(-1);
    },
  );