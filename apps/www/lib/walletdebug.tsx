"use client";

import { useAccount, useBalance, useNetwork, useEnsName } from "wagmi";

export default function WalletDebug() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { chain } = useNetwork();
  const { data: ensName } = useEnsName({ address });

  return (
    <div className="rounded-md border p-4">
      <h2 className="text-lg font-semibold">Wallet Debug Info</h2>
      {isConnected ? (
        <ul className="mt-2 text-sm">
          <li>
            <strong>Address:</strong> {address}
          </li>
          <li>
            <strong>ENS Name:</strong> {ensName ?? "N/A"}
          </li>
          <li>
            <strong>Balance:</strong> {balance?.formatted} {balance?.symbol}
          </li>
          <li>
            <strong>Network:</strong> {chain?.name} (ID: {chain?.id})
          </li>
        </ul>
      ) : (
        <p className="text-red-500">No wallet connected</p>
      )}
    </div>
  );
}
