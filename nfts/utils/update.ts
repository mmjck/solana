import { Metaplex, toMetaplexFile } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

export async function updateNftUri(
    metaplex: Metaplex,
    uri: string,
    mintAddress: PublicKey,) {

    const nft = await metaplex.nfts().findByMint({ mintAddress });

    // update the NFT metadata
    const { response } = await metaplex.nfts().update(
        {
            nftOrSft: nft,
            uri: uri,
        },
        { commitment: "finalized" },
    );



    console.log(
        `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`,
    );

    console.log(
        `Transaction: https://explorer.solana.com/tx/${response.signature}?cluster=devnet`,
    );
}