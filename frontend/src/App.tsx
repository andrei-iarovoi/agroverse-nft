import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract } from "wagmi";
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

  return (
    <div>
      <h1>AgroVerse NFT</h1>
      
      <ConnectButton />

      <p>Mint Price: {mintPrice?.toString()} wei</p>

      <p>Total Minted: {totalMinted?.toString()}</p>
    </div>
  );
}

export default App;