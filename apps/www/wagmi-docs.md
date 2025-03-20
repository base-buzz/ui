Installation
Get up and running with RainbowKit
Quick start
You can scaffold a new RainbowKit + wagmi + Next.js app with one of the following commands, using your package manager of choice:

npm init @rainbow-me/rainbowkit@latest

# or

pnpm create @rainbow-me/rainbowkit@latest

# or

yarn create @rainbow-me/rainbowkit

This will prompt you for a project name, generate a new directory containing a boilerplate project, and install all required dependencies.

Alternatively, you can manually integrate RainbowKit into your existing project.

Manual setup
Install RainbowKit and its peer dependencies, wagmi, viem, and @tanstack/react-query.

npm install @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query

Note: RainbowKit is a React library.

Import
Import RainbowKit, Wagmi and TanStack Query.

import '@rainbow-me/rainbowkit/styles.css';

import {
getDefaultConfig,
RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
mainnet,
polygon,
optimism,
arbitrum,
base,
} from 'wagmi/chains';
import {
QueryClientProvider,
QueryClient,
} from "@tanstack/react-query";

Configure
Configure your desired chains and generate the required connectors. You will also need to setup a wagmi config. If your dApp uses server side rendering (SSR) make sure to set ssr to true.

Note: Every dApp that relies on WalletConnect now needs to obtain a projectId from WalletConnect Cloud. This is absolutely free and only takes a few minutes.

...
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const config = getDefaultConfig({
appName: 'My RainbowKit App',
projectId: 'YOUR_PROJECT_ID',
chains: [mainnet, polygon, optimism, arbitrum, base],
ssr: true, // If your dApp uses server side rendering (SSR)
});

Wrap providers
Wrap your application with RainbowKitProvider, WagmiProvider, and QueryClientProvider.

const queryClient = new QueryClient();

const App = () => {
return (
<WagmiProvider config={config}>
<QueryClientProvider client={queryClient}>
<RainbowKitProvider>
{/_ Your App _/}
</RainbowKitProvider>
</QueryClientProvider>
</WagmiProvider>
);
};

Add the connect button
Then, in your app, import and render the ConnectButton component.

import { ConnectButton } from '@rainbow-me/rainbowkit';

export const YourApp = () => {
return <ConnectButton />;
};

RainbowKit will now handle your user's wallet selection, display wallet/transaction information and handle network/wallet switching.

Additional build tooling setup
Some build tools will require additional setup.

Remix
When using Remix, you must polyfill buffer, events and http modules. Reference the Remix configuration below, or our sample Remix project.

/** @type {import('@remix-run/dev').AppConfig} \*/
export default {
ignoredRouteFiles: ["**/.\*"],
browserNodeBuiltinsPolyfill: {
modules: { buffer: true, events: true, http: true },
},
};

Preparing to deploy
By default, your dApp uses public RPC providers for each chain to fetch balances, resolve ENS names, and more. This can often cause reliability issues for your users as public nodes are rate-limited. You should instead purchase access to an RPC provider through services like Alchemy or QuickNode, and define your own Transports in Wagmi. This can be achieved by adding the transports param in getDefaultConfig or via Wagmi's createConfig directly.

A Transport is the networking middle layer that handles sending JSON-RPC requests to the Ethereum Node Provider (like Alchemy, Infura, etc).

Example with an http transport

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

const config = getDefaultConfig({
appName: 'My RainbowKit App',
projectId: 'YOUR_PROJECT_ID',
chains: [mainnet, sepolia],
transports: {
[mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/...'),
[sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/...'),
},
});

For more details, view the wagmi transport docs.
