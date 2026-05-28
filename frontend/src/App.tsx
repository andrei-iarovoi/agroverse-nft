import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

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

  const { data: hash, writeContract } = useWriteContract();

  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

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

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between p-6 border-b border-white/10">
        <h1 className="text-3xl font-bold">AgroVerse NFT</h1>

        <ConnectButton />
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">
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
              className="bg-green-500 hover:bg-green-400 transition px-6 py-3 rounded-xl font-semibold text-black"
            >
              Mint NFT
            </button>

            <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-3">
              <p className="text-sm text-gray-400">Mint Price</p>
              <p className="font-bold">
                {mintPrice ? formatEther(mintPrice as bigint) : "0"} ETH
              </p>
            </div>
          </div>

          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-gray-400 mb-2">Collection Progress</p>

            <div className="flex items-center justify-between">
              <span>Total Minted</span>

              <span className="font-bold text-green-400">
                {totalMinted?.toString()} / 100
              </span>
            </div>
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

          {/* NFT GALLERY */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Collection Highlights</h3>

            <div className="grid grid-cols-2 gap-4">
              {nftItems.map((nft) => (
                <div
                  key={nft.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition"
                >
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="aspect-square object-cover rounded-xl mb-3"
                  />

                  <p className="font-semibold">{nft.name}</p>

                  <p className="text-sm text-gray-400">NFT #{nft.id}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
