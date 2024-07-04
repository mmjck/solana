import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { FC, ReactNode, useMemo } from "react";
import * as web3 from "@solana/web3.js";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const endpoint = web3.clusterApiUrl("devnet");
    const wallets = [new PhantomWalletAdapter()]


    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>

        </ConnectionProvider>
    )
};

export default WalletContextProvider;