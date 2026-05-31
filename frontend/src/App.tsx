import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  usePublicClient,
} from "wagmi";

import { useEffect, useState } from "react";

import { ABI, CONTRACT_ADDRESS } from "./contracts";

import { formatEther } from "viem";

import preview from "./assets/agroverse-preview.png";
import tomato from "./assets/nfts/tomato.png";
import pumpkin from "./assets/nfts/pumpkin.png";
import beekeeper from "./assets/nfts/beekeeper.png";
import corn from "./assets/nfts/corn.png";

const nftItems = [
  {
    id: 1,
    name: "Tomato Gardener",
    image: tomato,
  },
  {
    id: 2,
    name: "Pumpkin Farmer",
    image: pumpkin,
  },
  {
    id: 3,
    name: "Beekeeper Lemon",
    image: beekeeper,
  },
  {
    id: 4,
    name: "Corn Tractor Driver",
    image: corn,
  },
];

function App() {
  const { address } = useAccount();

  const [ownedTokens, setOwnedTokens] = useState<number[]>([]);

  const publicClient = usePublicClient();

  const { data: mintPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "mintPrice",
  });

  const { data: totalMinted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "nextTokenId",
  });

  const { data: ownerOfZero } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "ownerOf",
    args: [0n],
  });

  const { data: nftBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const mintedPercent = totalMinted ? (Number(totalMinted) / 100) * 100 : 0;

  const { data: hash, writeContract } = useWriteContract();

  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const isMinting = isConfirming;

  function mintNFT() {
    try {
      (writeContract as any)?.({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "mint",
        args: [],
        value: 1000000000000000n,
      });
    } catch (err) {
      console.error("mint failed", err);
    }
  }

  useEffect(() => {
    async function loadOwnedNFTs() {
      if (!address || !totalMinted || !publicClient) return;

      const tokens: number[] = [];

      for (let i = 0; i < Number(totalMinted); i++) {
        const owner = await (publicClient as any).readContract({
          address: CONTRACT_ADDRESS,
          abi: ABI,
          functionName: "ownerOf",
          args: [BigInt(i)],
        });

        if (
          typeof owner === "string" &&
          owner.toLowerCase() === address.toLowerCase()
        ) {
          tokens.push(i);
        }
      }

      setOwnedTokens(tokens);
    }

    loadOwnedNFTs();
  }, [address, totalMinted, publicClient]);

  const ownedNftItems = nftItems.filter((nft) =>
    ownedTokens.includes(nft.id - 1),
  );

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between p-6 border-b border-white/10">
        <h1 className="text-3xl font-bold">AgroVerse NFT</h1>

        <ConnectButton />
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-start">
        {/* LEFT SIDE */}
        <div>
          <p className="text-green-400 font-semibold mb-4">
            Web3 Farming Collection
          </p>

          <h2 className="text-5xl font-bold leading-tight mb-6">
            Cute Farmer NFTs living on Ethereum
          </h2>

          <p className="text-gray-400 text-lg mb-8">
            A handcrafted NFT collection featuring animated fruits and
            vegetables working as farmers, gardeners and beekeepers.
          </p>

          <div className="flex gap-4">
            <button
              onClick={mintNFT}
              disabled={isMinting}
              className={`
    px-6 py-3 rounded-xl font-semibold transition
    ${
      isMinting
        ? "bg-gray-500 cursor-not-allowed text-white"
        : "bg-green-500 hover:bg-green-400 text-black"
    }
  `}
            >
              {isMinting ? "Minting..." : "Mint NFT"}
            </button>

            <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-3">
              <p className="text-sm text-gray-400">Mint Price</p>
              <p className="font-bold">
                {mintPrice ? formatEther(mintPrice as bigint) : "0"} ETH
              </p>
            </div>
          </div>

          <p className="text-gray-400 mb-4">Collection Progress</p>

          <div className="w-full bg-black/30 rounded-full h-4 overflow-hidden">
            <div
              className="bg-green-400 h-full transition-all duration-500"
              style={{ width: `${mintedPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <span>Total Minted</span>

            <span className="font-bold text-green-400">
              {totalMinted?.toString()} / 100
            </span>
          </div>

          {isConfirming && (
            <p className="mt-6 text-yellow-400">Transaction pending...</p>
          )}

          {isSuccess && (
            <p className="mt-6 text-green-400">NFT minted successfully!</p>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          <img
            src={preview}
            alt="AgroVerse NFT Collection"
            className="rounded-3xl border border-white/10 shadow-2xl"
          />
        </div>

        {/* NFT GALLERY */}
        <div>
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4">
              Your NFTs ({ownedTokens.length})
            </h3>

            <p className="text-gray-400 mt-2 mb-6">
              NFTs currently owned by your connected wallet.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedNftItems.map((nft) => (
                <a
                  key={nft.id}
                  href={`https://sepolia.etherscan.io/token/${CONTRACT_ADDRESS}?a=${nft.id - 1}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-green-400 hover:scale-105 transition"
                >
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="aspect-square object-cover rounded-xl mb-3"
                  />

                  <p className="font-semibold">{nft.name}</p>

                  <p className="text-sm text-gray-400">NFT #{nft.id - 1}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
