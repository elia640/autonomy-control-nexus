import { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  DialogFooterRow,
  DialogHeader,
  DialogTitleText,
  FieldGroup,
  FieldHint,
  FieldLabel,
  SettingsDialogRoot,
  SettingsField,
  SettingsTab,
  SettingsTabs,
  TabBody,
} from "./SettingsDialog.styles";

export interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  /** Current radio frequency in MHz. */
  radioFrequency: number;
  onRadioFrequencyChange: (frequencyMhz: number) => void;
  /** Starts the system precheck sequence. */
  onRunPrecheck?: () => void;
}

type SettingsTabKey = "system" | "satellite" | "radio" | "cellular";

const TABS: { key: SettingsTabKey; label: string }[] = [
  { key: "system", label: "System" },
  { key: "satellite", label: "Satellite" },
  { key: "radio", label: "Radio" },
  { key: "cellular", label: "Cellular" },
];

export function SettingsDialog({
  open,
  onClose,
  radioFrequency,
  onRadioFrequencyChange,
  onRunPrecheck,
}: SettingsDialogProps) {
  const [tab, setTab] = useState<SettingsTabKey>("system");
  const [frequency, setFrequency] = useState(String(radioFrequency));

  const applyFrequency = () => {
    const parsed = Number.parseFloat(frequency);
    if (!Number.isNaN(parsed)) onRadioFrequencyChange(parsed);
    onClose();
  };

  return (
    <SettingsDialogRoot open={open} onClose={onClose} aria-labelledby="settings-title">
      <DialogHeader>
        <SettingsIcon fontSize="small" color="primary" />
        <DialogTitleText id="settings-title">SYSTEM SETTINGS</DialogTitleText>
        <IconButton size="small" aria-label="Close settings" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogHeader>

      <SettingsTabs
        value={tab}
        onChange={(_event, value: SettingsTabKey) => setTab(value)}
        aria-label="Settings sections"
      >
        {TABS.map((item) => (
          <SettingsTab key={item.key} value={item.key} label={item.label} />
        ))}
      </SettingsTabs>

      {tab === "satellite" && (
        <TabBody>
          <FieldGroup>
            <FieldLabel>Satellite</FieldLabel>
            <SettingsField select size="small" defaultValue="TELS-1">
              <MenuItem value="TELS-1">TELS-1</MenuItem>
              <MenuItem value="TELS-2">TELS-2</MenuItem>
            </SettingsField>
            <FieldHint>Active spacecraft used for the SATCOM uplink.</FieldHint>
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Beam / Transponder</FieldLabel>
            <SettingsField size="small" defaultValue="KA-04" />
            <FieldHint>Transponder assignment for the ground terminal.</FieldHint>
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Symbol rate (Msym/s)</FieldLabel>
            <SettingsField size="small" type="number" defaultValue={12} />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Modulation</FieldLabel>
            <SettingsField select size="small" defaultValue="8PSK">
              <MenuItem value="QPSK">QPSK</MenuItem>
              <MenuItem value="8PSK">8PSK</MenuItem>
              <MenuItem value="16APSK">16APSK</MenuItem>
            </SettingsField>
          </FieldGroup>
        </TabBody>
      )}

      {tab === "radio" && (
        <TabBody>
          <FieldGroup>
            <FieldLabel>Radio frequency (MHz)</FieldLabel>
            <SettingsField
              size="small"
              type="number"
              value={frequency}
              slotProps={{ htmlInput: { step: 0.025, min: 30, max: 6000 } }}
              onChange={(event) => setFrequency(event.target.value)}
            />
            <FieldHint>Mesh operating frequency shared by all platforms.</FieldHint>
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Channel bandwidth</FieldLabel>
            <SettingsField select size="small" defaultValue="20">
              <MenuItem value="5">5 MHz</MenuItem>
              <MenuItem value="10">10 MHz</MenuItem>
              <MenuItem value="20">20 MHz</MenuItem>
            </SettingsField>
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Mesh network ID</FieldLabel>
            <SettingsField size="small" defaultValue="MESH-A" />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>TX power (dBm)</FieldLabel>
            <SettingsField size="small" type="number" defaultValue={27} />
          </FieldGroup>
        </TabBody>
      )}

      {tab === "cellular" && (
        <TabBody>
          <FieldGroup>
            <FieldLabel>Preferred network</FieldLabel>
            <SettingsField select size="small" defaultValue="5G">
              <MenuItem value="AUTO">Auto</MenuItem>
              <MenuItem value="LTE">LTE</MenuItem>
              <MenuItem value="5G">5G NR</MenuItem>
            </SettingsField>
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>APN</FieldLabel>
            <SettingsField size="small" defaultValue="fleet.ops" />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>SIM priority</FieldLabel>
            <SettingsField select size="small" defaultValue="SIM 1">
              <MenuItem value="SIM 1">SIM 1</MenuItem>
              <MenuItem value="SIM 2">SIM 2</MenuItem>
              <MenuItem value="SIM 3">SIM 3</MenuItem>
            </SettingsField>
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Data cap per SIM (GB)</FieldLabel>
            <SettingsField size="small" type="number" defaultValue={50} />
          </FieldGroup>
        </TabBody>
      )}

      <DialogFooterRow>
        <Button size="small" color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button size="small" variant="contained" onClick={applyFrequency}>
          Apply
        </Button>
      </DialogFooterRow>
    </SettingsDialogRoot>
  );
}
