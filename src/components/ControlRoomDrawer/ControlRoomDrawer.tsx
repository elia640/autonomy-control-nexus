import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { SectionHeader } from "@/components/GLOBAL/SectionHeader";
import { ModemPanel } from "@/components/ModemPanel";
import { RadioPanel } from "@/components/RadioPanel";
import { MonitoringGraph } from "@/components/MonitoringGraph";
import { controlRoomModem, controlRoomRadio, monitoringSamples } from "@/data/modems";
import { MAX_BANDWIDTH_MBPS } from "@/data/network";
import { DrawerHeader, DrawerStack, StyledDrawer } from "./ControlRoomDrawer.styles";

export interface ControlRoomDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Name of the internal command post modem, e.g. "J8". */
  modemName?: string;
}

/** Right-side drawer with the control room modem and radio parameters. */
export function ControlRoomDrawer({ open, onClose, modemName = "J8" }: ControlRoomDrawerProps) {
  const [modemExpanded, setModemExpanded] = useState(true);
  const [radioExpanded, setRadioExpanded] = useState(false);
  const [radioOn, setRadioOn] = useState(true);

  return (
    <StyledDrawer anchor="right" open={open} onClose={onClose} transitionDuration={260}>
      <DrawerHeader>
        CONTROL ROOM · {modemName}
        <IconButton size="small" onClick={onClose} aria-label="Close control room parameters">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DrawerHeader>

      <DrawerStack>
        <SectionHeader title="Communication Assets" />
        <ModemPanel
          modem={{ ...controlRoomModem, name: modemName }}
          expanded={modemExpanded}
          onExpandedChange={setModemExpanded}
        />
        <RadioPanel
          radio={controlRoomRadio}
          expanded={radioExpanded}
          onExpandedChange={setRadioExpanded}
          enabled={radioOn}
          onEnabledChange={setRadioOn}
          lastActive={false}
        />
        <SectionHeader title="Control Room Monitoring" />
        <MonitoringGraph samples={monitoringSamples(0)} maxBandwidth={MAX_BANDWIDTH_MBPS} />
      </DrawerStack>
    </StyledDrawer>
  );
}
