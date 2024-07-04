import { initializeKeypair } from "@solana-developers/helpers";
import { Connection, Signer, clusterApiUrl } from "@solana/web3.js";
import { Metaplex, bundlrStorage, keypairIdentity } from "@metaplex-foundation/js"
import { uploadMetadata } from "./utils/upload";
import { createNft } from "./utils/create";
import {collectionNftData, nftData, updateNftData} from "./utils/populate"
import { updateNftUri } from "./utils/update";
import { createCollectionNft } from "./utils/create-collections";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));

  const user = await initializeKeypair(connection);

  console.log("PublicKey:", user.publicKey.toBase58());


  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(user))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      }),
    );


      // upload the NFT data and get the URI for the metadata
  const uri = await uploadMetadata(metaplex, nftData)

  // create an NFT using the helper function and the URI from the metadata
  const nft = await createNft(metaplex, uri, nftData)

   // upload updated NFT data and get the new URI for the metadata
   const updatedUri = await uploadMetadata(metaplex, updateNftData)

   // update the NFT using the helper function and the new URI from the metadata
   await updateNftUri(metaplex, updatedUri, nft.address)

    // upload data for the collection NFT and get the URI for the metadata
  const collectionUri = await uploadMetadata(metaplex, collectionNftData)

  // create a collection NFT using the helper function and the URI from the metadata
  const collectionNft = await createCollectionNft(
    metaplex,
    collectionUri,
    collectionNftData
  )

}


main()
  .then(() => {
    console.log("Finished successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
