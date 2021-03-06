import React, { memo, useMemo } from "react";
import { arrayToggle } from "../../../utils";
import { trackEvent } from "../../../utils/umami";
import { useConfig } from "../../../utils/configs";
import { Character } from "../../../db/characters";
import { chakra, Checkbox, VStack } from "@chakra-ui/react";

const Toggle = ({ character }: { character: Character }) => {
  const [list, setList] = useConfig("characters");
  const exists = useMemo(() => list.includes(character.name), [list, character]);

  return (
    <Checkbox
      isChecked={exists}
      onChange={({ target: { checked } }) => {
        setList((list) => arrayToggle(list, character.name, checked));
        trackEvent("character", "toggle");
      }}
    >
      <VStack align="start" spacing={0}>
        <div>Show on schedule</div>

        <chakra.div fontSize="sm" color="gray.500">
          Scheduled domains will appear on the days they are available.
        </chakra.div>
      </VStack>
    </Checkbox>
  );
};

export default memo(Toggle);
