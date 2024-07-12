import {
    Connection, Keypair, PublicKey, TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
    VersionedTransactionResponse,
} from "@solana/web3.js";
import fs from "fs";
import path from "path"



// define some default locations
const DEFAULT_KEY_DIR_NAME = ".local_keys";
const DEFAULT_PUBLIC_KEY_FILE = "keys.json";
const DEFAULT_DEMO_DATA_FILE = "demo.json";


export function loadPublicKeysFromFile(
    absPath: string = `${DEFAULT_KEY_DIR_NAME}/${DEFAULT_PUBLIC_KEY_FILE}`,
) {

    try {

        if (!absPath) {
            throw Error("No path provider")
        }

        if (!fs.existsSync(absPath)) {
            throw Error("File does not exist.");
        }

        const data = JSON.parse(fs.readFileSync(absPath, { encoding: "utf-8" })) || {};

        for (const [key, value] of Object.entries(data)) {
            if (key && data[key]) {
                data[key] = new PublicKey(value as string) ?? ""
            }
        }

        return data;
    } catch (error) {
        console.log(error);

    }

    return {}

}

export function saveDemoDataToFile(
    name: string,
    newData: any,
    absPath: string = `${DEFAULT_KEY_DIR_NAME}/${DEFAULT_DEMO_DATA_FILE}`,
) {

    let data: object = {};

    try {
        if (fs.existsSync(absPath)) {
            data = JSON.parse(fs.readFileSync(absPath, { encoding: "utf-8" })) || {};
        }

        data = { ...data, [name]: newData }


        fs.writeFileSync(absPath, JSON.stringify(data), {
            encoding: "utf-8"
        })

        return data;
    } catch (error) {
        console.warn("Unable to save to file");

    }

    return {};
}



export function saveKeypairToFile(
    keypair: Keypair,
    fileName: string,
    dirName: string = DEFAULT_KEY_DIR_NAME,
) {
    fileName = path.join(dirName, `${fileName}.json`);
    // create the `dirName` directory, if it does not exists
    if (!fs.existsSync(`./${dirName}/`)) {
        fs.mkdirSync(`./${dirName}/`);
    }

    // remove the current file, if it already exists
    if (fs.existsSync(`./${dirName}/${fileName}`)) {
        fs.unlinkSync(`./${dirName}/${fileName}`);
    }

    // write the `secretKey` value as a string
    fs.writeFileSync(fileName, `[${keypair.secretKey.toString()}]`, {
        encoding: "utf-8",
    });

    return fileName;
}


export function loadKeypairFromFile(absPath: string) {
    try {
        if (!absPath) {
            throw Error("No path provider")
        }

        if (!fs.existsSync(absPath)) {
            throw Error("File does not exists.")
        }


        const file = fs.readFileSync(absPath, { encoding: "utf-8" });

        const str = file.replace("[", "").replace("]", "")
        const data = str.split(",").map(e => parseInt(e));

        const d = new Uint8Array(data);
        const keypair = Keypair.fromSecretKey(d)
        return keypair
    } catch (error) {
        throw error
    }

}


export function loadOrGenerateKeypair(
    fileName: string,
    dirName: string = DEFAULT_KEY_DIR_NAME
) {
    try {
        const searchPath = path.join(dirName, `${fileName}.json`)

        let keypair = Keypair.generate()

        if (fs.existsSync(searchPath)) {
            keypair = loadKeypairFromFile(searchPath);
        } else {
            saveKeypairToFile(keypair, fileName, dirName);
        }
        return keypair;

    } catch (error) {
        console.error("loadOrGenerateKeypair:", error);
        throw error;
    }
}

export function explorerURL({
    address,
    txSignature,
    cluster,
}: {
    address?: string;
    txSignature?: string;
    cluster?: "devnet" | "testnet" | "mainnet" | "mainnet-beta";
}) {

    let baseUrl: string

    if (address) {
        baseUrl = `https://explorer.solana.com/address/${address}`;
    }
    else if (txSignature) {
        baseUrl = `https://explorer.solana.com/tx/${txSignature}`;
    } else {
        return "[unknown]";
    }

    const url = new URL(baseUrl)

    url.searchParams.append("cluster", cluster || "devnet")
    return url.toString + "\n"

}

export function printConsoleSeparator(message?: string) {
    console.log("\n===============================================");
    console.log("===============================================\n");
    if (message) console.log(message);
}


export async function buildTransaction({
    connection,
    payer,
    signers,
    instructions,
}: {
    connection: Connection;
    payer: PublicKey;
    signers: Keypair[];
    instructions: TransactionInstruction[];
}): Promise<VersionedTransaction> {
    let blockhash = await connection.getLatestBlockhash().then(res => res.blockhash)

    const messageV0 = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: blockhash,
        instructions
    }).compileToV0Message()


    const tx = new VersionedTransaction(messageV0)

    signers.forEach(s => tx.sign([s]))

    return tx
}


export function savePublicKeyToFile(
    name: string,
    publicKey: PublicKey,
    absPath: string = `${DEFAULT_KEY_DIR_NAME}/${DEFAULT_PUBLIC_KEY_FILE}`,
) {

    try {
        let data: any = loadKeypairFromFile(absPath)

        for (const [key, value] of Object.entries(data)) {
            data[key as any] = (value as PublicKey).toBase58();
        }

        data = { ...data, [name]: publicKey.toBase58() }


        fs.writeFileSync(absPath, JSON.stringify(data), {
            encoding: "utf-8",
        });

        data = loadPublicKeysFromFile(absPath);

        return data
    } catch (error) {
        console.warn("Unable to save to file");
    }
    return {}
}

export async function extractSignatureFromFailedTransaction(
    connection: Connection,
    err: any,
    fetchLogs?: boolean,
  ) {
    if (err?.signature) return err.signature;
  
    // extract the failed transaction's signature
    const failedSig = new RegExp(/^((.*)?Error: )?(Transaction|Signature) ([A-Z0-9]{32,}) /gim).exec(
      err?.message?.toString(),
    )?.[4];
  
    // ensure a signature was found
    if (failedSig) {
      // when desired, attempt to fetch the program logs from the cluster
      if (fetchLogs)
        await connection
          .getTransaction(failedSig, {
            maxSupportedTransactionVersion: 0,
          })
          .then(tx => {
            console.log(`\n==== Transaction logs for ${failedSig} ====`);
            console.log(explorerURL({ txSignature: failedSig }), "");
            console.log(tx?.meta?.logMessages ?? "No log messages provided by RPC");
            console.log(`==== END LOGS ====\n`);
          });
      else {
        console.log("\n========================================");
        console.log(explorerURL({ txSignature: failedSig }));
        console.log("========================================\n");
      }
    }
  
    // always return the failed signature value
    return failedSig;
  }

