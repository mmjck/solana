// import custom helpers for demos
import { payer, connection } from "@/lib/var";
import { explorerURL, loadPublicKeysFromFile } from "@/lib/helpers";

import { PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";

const main = async () => {
    console.log("Payer address:", payer.publicKey.toBase58());

    let localKeys = loadPublicKeysFromFile();


    if (!localKeys?.tokenMint) {
        return console.warn("No local keys were found. Please run '3.createTokenWithMetadata.ts'");
    }


    const tokenMint: PublicKey = localKeys.tokenMint;


    console.log("==== Local PublicKeys loaded ====");
    console.log("Token's mint address:", tokenMint.toBase58());
    console.log(explorerURL({ address: tokenMint.toBase58() }));


}
main()
    .then(() => {
        process.exit(1)
    })
    .catch((err) => {
        console.log(err);
        process.exit(1)
    })