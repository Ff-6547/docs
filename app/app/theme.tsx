'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { goerli, holesky, mainnet, sepolia } from 'viem/chains';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';

const config = createConfig({
    chains: [mainnet, goerli, sepolia, holesky],
    connectors: [
        injected({}),
        walletConnect({
            projectId: 'b451d5ff25d61b3fde7b30f167a5a957',
            showQrModal: false,
        }),
    ],
    transports: {
        [mainnet.id]: http(),
        [goerli.id]: http(),
        [sepolia.id]: http(),
        [holesky.id]: http(),
    },
});

declare module 'wagmi' {
    interface Register {
        config: typeof config;
    }
}

const queryClient = new QueryClient();

export const Theme = ({ children }) => {
    useEffect(() => {
        (async () => {
            const { setupConfig } = await import('@ens-tools/thorin-core');

            setupConfig(config as any);
        })();
    }, []);

    return (
        <ThemeProvider attribute="class">
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={config}>{children}</WagmiProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
};
