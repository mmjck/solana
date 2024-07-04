import { Metaplex, toMetaplexFile } from "@metaplex-foundation/js";
import { NftData } from "../interfaces";
import * as fs from "fs"


export async function uploadMetadata(metaplex: Metaplex, nftData: NftData): Promise<string> {
    const buffer = fs.readFileSync("../assets" + nftData.imageFile)

    const file = toMetaplexFile(buffer, nftData.imageFile)


    const imageUri = await metaplex.cluster.storage().uoload(file)
    console.log("image uri:", imageUri);

    const { uri } = await metaplex.cluster.nfts().uploadMetadata({
        name: nftData.name,
        symbol: nftData.symbol,
        description: nftData.description,
        image: imageUri,
    })


    console.log("metadata uri:", uri);
    return uri;
    
}