import { LogoEvmos } from "./svg/Logo";
import { Stack } from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { ColorMode } from "@thirdweb-dev/react/dist/declarations/src/components/theme";
import React from "react";
import chakraTheme from "./theme";

interface HeaderProps {
  primaryColor: string;
  colorScheme: ColorMode;
}

export const Header: React.FC<HeaderProps> = ({
  primaryColor,
  colorScheme,
}) => {
  const colors = chakraTheme.colors;
  const accentColor = colors[primaryColor as keyof typeof colors][500];

  return (
    <Stack
      as="header"
      px="28px"
      direction="row"
      spacing="20px"
      w="100%"
      flexGrow={0}
      borderBottom="1px solid rgba(0,0,0,.1)"
      justify="space-between"
      py={2}
    > 
      <LogoEvmos />
      <ConnectWallet accentColor={accentColor} colorMode={colorScheme} />
    </Stack>
  );
};
