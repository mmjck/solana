import { Metaplex, } from "@metaplex-foundation/js";
import { NftData } from "../interfaces";

export async function createNft(metaplex: Metaplex, uri: string, collectionMintAddress: string, nftData: NftData): Promise<any> {
  const { nft } = await metaplex.nfts().create(
    {
      uri: uri,
      name: nftData.name,
      sellerFeeBasisPoints: nftData.sellerFeeBasisPoints,
      symbol: nftData.symbol,
    },
    { commitment: "finalized" },
  );

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`,
  );

  //this is what verifies our collection as a Certified Collection
  await metaplex.nfts().verifyCollection({
    mintAddress: nft.mint.address,
    collectionMintAddress: collectionMintAddress,
    isSizedCollection: true,
  })

  return nft;
}