import { payer, connection, STATIC_PUBLICKEY } from "@/lib/var";


import { explorerURL, loadPublicKeysFromFile, printConsoleSeparator } from "@/lib/helpers";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js"


const main = async () => {
    console.log("Payer address:", payer.publicKey.toBase58());

    let localKeys = loadPublicKeysFromFile()

    console.log(localKeys);
    

    if(!localKeys?.tokenMint){
        return console.warn("No local keys were found. Please run '3.createTokenWithMetadata.ts'");
    }

    const tokenMint: PublicKey = localKeys.tokenMint;

    console.log("==== Local PublicKeys loaded ====");
    console.log("Token's mint address:", tokenMint.toBase58());
    console.log(explorerURL({ address: tokenMint.toBase58() }));
  

}

main();