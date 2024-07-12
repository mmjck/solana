import { payer, testWallet, connection, STATIC_PUBLICKEY } from "@/lib/var";


import { explorerURL, printConsoleSeparator } from "@/lib/helpers";
import { SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js"



const main = async () => {
    console.log("Payer address:", payer.publicKey.toBase58());
    console.log("Test wallet address:", testWallet.publicKey.toBase58());

    const space = 0

    const balanceForRentExemption = await connection.getMinimumBalanceForRentExemption(space)


    const createTestAccountIx = SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: testWallet.publicKey,
        lamports: balanceForRentExemption + 2_000_000,
        space,
        programId: SystemProgram.programId
    });


    const transferToTestWalletIx = SystemProgram.transfer({
        lamports: balanceForRentExemption + 100_000,
        fromPubkey: payer.publicKey,
        toPubkey: testWallet.publicKey,
        programId: SystemProgram.programId,
    });



    const transferToStaticWalletIx = SystemProgram.transfer({
        lamports: 100_000,
        fromPubkey: payer.publicKey,
        toPubkey: STATIC_PUBLICKEY,
        programId: SystemProgram.programId,
    })




    let recentBlockhash = await connection.getLatestBlockhash().then(res => res.blockhash);


    const message = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash,
        instructions: [
            createTestAccountIx,
            transferToStaticWalletIx,
            transferToTestWalletIx,
            transferToStaticWalletIx,
        ]
    }).compileToV0Message();


    const tx = new VersionedTransaction(message);

    tx.sign([payer, testWallet])

    const sig = await connection.sendTransaction(tx);

    printConsoleSeparator()

    console.log("Transaction completed.");
    console.log(explorerURL({ txSignature: sig }));

}


 main()
 .then(() => {
    process.exit(1)
 })
 .catch((err) => {
    console.log(err);
    process.exit(1)
 })