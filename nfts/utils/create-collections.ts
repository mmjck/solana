import { Metaplex, } from "@metaplex-foundation/js";
import { CollectionNftData } from "../interfaces";


export async function createCollectionNft(
    metaplex: Metaplex,
    uri: string,
    data: CollectionNftData
): Promise<any> {

    const { nft } = await metaplex.nfts().create({
        uri: uri,
        name: data.name,
        sellerFeeBasisPoints: data.sellerFeeBasisPoints,
        symbol: data.symbol,
        isCollection: true,
    },
        { commitment: "finalized" }
    )


    console.log(
        `Collection Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
    )

    return nft

}