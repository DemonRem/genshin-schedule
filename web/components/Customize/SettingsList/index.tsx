import React, { memo } from "react";
import { DarkMode, HStack, Icon, VStack } from "@chakra-ui/react";
import { FaCog } from "react-icons/fa";
import BackgroundToggle from "./BackgroundToggle";
import SignOutButton from "./SignOutButton";

const SettingsList = () => {
  return (
    <VStack align="stretch" spacing={4}>
      <HStack fontSize="xl" fontWeight="bold" spacing={2} color="white">
        <Icon as={FaCog} w={8} h={8} />
        <div>Settings</div>
      </HStack>

      <DarkMode>
        <VStack align="start" spacing={2} color="white">
          <BackgroundToggle />
          <SignOutButton />
        </VStack>
      </DarkMode>
    </VStack>
  );
};

export default memo(SettingsList);
