import dotenv from "dotenv"


import { Connection, clusterApiUrl } from "@solana/web3.js"
import { PublicKey } from "@metaplex-foundation/js"
import { loadKeypairFromFile, loadOrGenerateKeypair } from "./helpers";




dotenv.config();


export const payer = process.env?.LOCAL_PAYER_JSON_ABSPATH
  ? loadKeypairFromFile(process.env?.LOCAL_PAYER_JSON_ABSPATH)
  : loadOrGenerateKeypair("payer");


export const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl("devnet");

export const connection = new Connection(CLUSTER_URL, "single")

export const STATIC_PUBLICKEY = new PublicKey("E7JFnmXJtKQcdMMHfYJvqFMJe5DuvQmDmKMAFhMcppBb");

// generate a new Keypair for testing, named `wallet`
export const testWallet = loadOrGenerateKeypair("testWallet");
