import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "AgroVerse NFT",
  projectId: "6e78c9e4c138063bf88700ae33ddb52d",
  chains: [sepolia],
  ssr: false,
});