import { payer, testWallet, connection, STATIC_PUBLICKEY } from "@/lib/var";


import { buildTransaction, explorerURL, extractSignatureFromFailedTransaction, loadPublicKeysFromFile, printConsoleSeparator, savePublicKeyToFile } from "@/lib/helpers";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js"


import {
    PROGRAM_ID as METADATA_PROGRAM_ID,
    createCreateMetadataAccountV3Instruction,
    createMetadataAccountV3InstructionDiscriminator,
} from "@metaplex-foundation/mpl-token-metadata";



import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMint2Instruction } from "@solana/spl-token";



const main = async () => {
    console.log("Payer address:", payer.publicKey.toBase58());
    console.log("Test wallet address:", testWallet.publicKey.toBase58());


    const mintKeypair = Keypair.generate();

    console.log("Mint address:", mintKeypair.publicKey.toBase58());



    const tokenConfig = {
        decimals: 2,
        name: "Boto Gold",
        symbol: "BOTO",
        uri: ""
    }

    const createMintAccountInstruction = SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports: await connection.getMinimumBalanceForRentExemption(MINT_SIZE),
        programId: SystemProgram.programId
    })

    const initializeMintInstruction = createInitializeMint2Instruction(
        mintKeypair.publicKey,
        tokenConfig.decimals,
        payer.publicKey,
        payer.publicKey,
    );


    const metadataAccount = PublicKey.findProgramAddressSync([
        Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mintKeypair.publicKey.toBuffer()],
        METADATA_PROGRAM_ID,
    )[0];


    console.log("Metadata address:", metadataAccount.toBase58());


    // Create the Metadata account for the Mint

    const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
        {
            metadata: metadataAccount,
            mint: mintKeypair.publicKey,
            mintAuthority: payer.publicKey,
            payer: payer.publicKey,
            updateAuthority: payer.publicKey,
        },
        {
            createMetadataAccountArgsV3: {
                data: {
                    creators: null,
                    name: tokenConfig.name,
                    symbol: tokenConfig.symbol,
                    uri: tokenConfig.uri,
                    sellerFeeBasisPoints: 0,
                    collection: null,
                    uses: null,
                },
                // `collectionDetails` - for non-nft type tokens, normally set to `null` to not have a value set
                collectionDetails: null,
                // should the metadata be updatable?
                isMutable: true,
            },
        },
    )

    const tx = await buildTransaction({
        connection,
        payer: payer.publicKey,
        signers: [payer, mintKeypair],
        instructions: [
            createMintAccountInstruction,
            initializeMintInstruction,
            createMetadataInstruction,
        ],


    });

    printConsoleSeparator();


    try {
        const sig = await connection.sendTransaction(tx);

        // print the explorer url
        console.log("Transaction completed.");
        console.log(explorerURL({ txSignature: sig }));

        savePublicKeyToFile("tokenMint", mintKeypair.publicKey);
    } catch (error) {
        console.error("Failed to send transaction:");
        console.log(tx);

        // attempt to extract the signature from the failed transaction
        const failedSig = await extractSignatureFromFailedTransaction(connection, error);
        if (failedSig) console.log("Failed signature:", explorerURL({ txSignature: failedSig }));


    }


}



main()
    .then(() => {
        process.exit(1)
    })
    .catch((err) => {
        console.log(err);
        process.exit(1)
    })