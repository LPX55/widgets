import {
  ChakraProvider,
  ColorMode,
  Flex,
  useColorMode,
} from "@chakra-ui/react";
import { css, Global } from "@emotion/react";
import { ThirdwebProvider, useContract } from "@thirdweb-dev/react";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Body } from "../shared/body";
import { ERC721ClaimButton } from "../shared/claim-button-erc721";
import { ContractMetadataPage } from "../shared/contract-metadata-page";
import { Footer } from "../shared/footer";
import { Header } from "../shared/header";
import { useGasless } from "../shared/hooks/useGasless";
import chakraTheme from "../shared/theme";
import { fontsizeCss } from "../shared/theme/typography";
import { parseIpfsGateway } from "../utils/parseIpfsGateway";

interface NFTDropEmbedProps {
  contractAddress: string;
  colorScheme: ColorMode;
  primaryColor: string;
}

const NFTDropEmbed: React.FC<NFTDropEmbedProps> = ({
  contractAddress,
  colorScheme,
  primaryColor,
}) => {
  const { setColorMode } = useColorMode();
  const { contract: nftDrop } = useContract(contractAddress, "nft-drop");

  useEffect(() => {
    setColorMode(colorScheme);
  }, [colorScheme, setColorMode]);

  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      bottom={0}
      right={0}
      flexDir="column"
      borderRadius="1rem"
      overflow="hidden"
      shadow="0px 1px 1px rgba(0,0,0,0.1)"
      border="1px solid"
      borderColor="borderColor"
      bgColor="backgroundHighlight"
    >
      <Header primaryColor={primaryColor} colorScheme={colorScheme} />
      <Body>
        <ContractMetadataPage contract={nftDrop}>
          {nftDrop && (
            <ERC721ClaimButton
              contract={nftDrop}
              colorScheme={colorScheme}
              primaryColor={primaryColor}
            />
          )}
        </ContractMetadataPage>
      </Body>
      <Footer />
    </Flex>
  );
};

const urlParams = new URL(window.location.toString()).searchParams;

const App: React.FC = () => {
  const chainId = 137;
  const contractAddress = urlParams.get("contract") || "0xfcA986C13600502E3B9bc285bE2cdb54C7063C97";
  const rpcUrl = urlParams.get("rpcUrl") || "";
  const relayerUrl = urlParams.get("relayUrl") || "https://api.defender.openzeppelin.com/autotasks/4685dd5e-db3d-472c-97ff-c02b1290577f/runs/webhook/93e5fe57-9d61-4f42-9ddf-75e4868c17eb/S9MCY7vQRMbiNwT71guWbT";
  const biconomyApiKey = urlParams.get("biconomyApiKey") || "";
  const biconomyApiId = urlParams.get("biconomyApiId") || "";

  const colorScheme = urlParams.get("theme") === "dark" ? "dark" : "light";
  const primaryColor = urlParams.get("primaryColor") || "purple";

  const ipfsGateway = parseIpfsGateway(urlParams.get("ipfsGateway") || "");

  const sdkOptions = useGasless(relayerUrl, biconomyApiKey, biconomyApiId);

  return (
    <>
      <Global
        styles={css`
          :host,
          :root {
            ${fontsizeCss};
          }
        `}
      />
      <ChakraProvider theme={chakraTheme}>
        <ThirdwebProvider
          desiredChainId={chainId}
          sdkOptions={sdkOptions}
          storageInterface={
            ipfsGateway
              ? new ThirdwebStorage({
                  gatewayUrls: {
                    "ipfs://": [ipfsGateway],
                  },
                })
              : undefined
          }
          chainRpc={{ [chainId]: rpcUrl }}
        >
          <NFTDropEmbed
            contractAddress={contractAddress}
            colorScheme={colorScheme}
            primaryColor={primaryColor}
          />
        </ThirdwebProvider>
      </ChakraProvider>
    </>
  );
};

const container = document.getElementById("root") as Element;
const root = createRoot(container);
root.render(<App />);
