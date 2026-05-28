import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ABI, CONTRACT_ADDRESS } from "./contracts";

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

  // useWriteContract without parameters returns a `writeContract` function we
  // can call with the full contract call options. The returned `data` (here
  // called `hash`) will contain the transaction hash after sending.
  const { data: hash, writeContract } = useWriteContract();

  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  function mintNFT() {
    // Call the write function with the contract call details. We cast to
    // `any` here because the project's wagmi types in this workspace don't
    // match the runtime call signature exactly. This avoids TypeScript
    // compile errors while keeping the runtime behavior correct.
    try {
      (writeContract as any)?.({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "mint",
        args: [],
        value: 1000000000000000n,
      });
      console.log("mint transaction submitted");
    } catch (err) {
      console.error("mint failed", err);
    }
  }
  

  return (
    <div>
      <h1>AgroVerse NFT</h1>

      <ConnectButton />

      <button onClick={mintNFT}>Mint NFT</button>

      <p>Mint Price: {mintPrice?.toString()} wei</p>

      <p>Total Minted: {totalMinted?.toString()}</p>

      {isConfirming && <p>Transaction pending...</p>}

      {isSuccess && <p>NFT minted successfully!</p>}
    </div>
  );
}

export default App;