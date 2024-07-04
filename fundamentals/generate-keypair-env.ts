import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import dotenv from "dotenv"
import path from 'path';


dotenv.config({ path: path.join(__dirname, "../.env")})


const keypair = getKeypairFromEnvironment("SECRET_KEY")

console.log(`✅ Generated keypair!`)

console.log("The public key is: ", keypair.publicKey.toBase58());
console.log("The secret key is: ", keypair.secretKey);

console.log(`✅ Finished! We've loaded our secret key securely, using an env file!`);

