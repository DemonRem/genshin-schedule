import React, { Dispatch, memo, ReactNode, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { Task, useConfig } from "../../../utils/configs";
import { Icon } from "leaflet";
import CardPopup from "../CardPopup";
import MarkerWrapper from "./MarkerWrapper";
import BackButton from "./BackButton";
import InfoPage from "./InfoPage";
import IconPage from "./IconPage";
import { getAssetByName } from "../../../assets";
import { HStack } from "@chakra-ui/react";

export type PopupPage = "info" | "icon";
export const PopupPages: PopupPage[] = ["info", "icon"];

const TaskMarker = ({
  task,
  setTask,
  alwaysOpen,
  showDue = true,
  onOpen,
  onClose,
  footer,
}: {
  task: Task;
  setTask: Dispatch<SetStateAction<Task>>;
  alwaysOpen?: boolean;
  showDue?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  footer?: ReactNode;
}) => {
  const markerRef = useRef<any>(null);
  const popupRef = useRef<any>(null);

  const icon = useMemo(() => {
    return new Icon({
      iconUrl: getAssetByName(task.icon) || "",
      iconSize: [36, 36],
    });
  }, [task.icon]);

  const [focusedTask, setFocusedTask] = useConfig("mapFocusedTask");
  const focused = focusedTask === task.id;

  useEffect(() => {
    if (alwaysOpen || focused) {
      markerRef.current.openPopup();
    }
  }, [task, focused, alwaysOpen]);

  const [page, setPage] = useState<PopupPage>(PopupPages[0]);

  return (
    <MarkerWrapper task={task} markerRef={markerRef} position={task.location} icon={icon}>
      <CardPopup
        popupRef={popupRef}
        divide
        onOpen={() => {
          onOpen?.();
          setFocusedTask(task.id);
        }}
        onClose={() => {
          onClose?.();
          focused && setFocusedTask(false);
        }}
      >
        {useMemo(
          () =>
            page === "info" ? (
              <InfoPage task={task} setTask={setTask} setPage={setPage} autoFocus={alwaysOpen} showDue={showDue} />
            ) : page === "icon" ? (
              <IconPage setTask={setTask} setPage={setPage} />
            ) : null,
          [alwaysOpen, page, setTask, showDue, task]
        )}

        <HStack fontSize="sm" spacing={2} justify={page === "info" ? "flex-end" : undefined}>
          {page === "info" ? footer : <BackButton onClick={() => setPage("info")} />}
        </HStack>
      </CardPopup>
    </MarkerWrapper>
  );
};

export default memo(TaskMarker);
