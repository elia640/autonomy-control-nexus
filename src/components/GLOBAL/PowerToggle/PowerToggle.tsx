import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ToggleThumb, ToggleTrack } from "./PowerToggle.styles";

export interface PowerToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name, e.g. "PLATFORM 1 SIM 2". */
  label: string;
  disabled?: boolean;
  /** Ask for confirmation before applying the new state. Defaults to true. */
  confirm?: boolean;
  /**
   * Blocks switching off: this is the last active communication range.
   * A warning is shown instead of the confirmation.
   */
  lastActive?: boolean;
}

export function PowerToggle({
  checked,
  onChange,
  label,
  disabled,
  confirm = true,
  lastActive = false,
}: PowerToggleProps) {
  const [open, setOpen] = useState(false);
  const blocked = checked && lastActive;

  const request = () => {
    if (!confirm) {
      if (blocked) return;
      onChange(!checked);
      return;
    }
    setOpen(true);
  };

  const accept = () => {
    setOpen(false);
    if (!blocked) onChange(!checked);
  };

  return (
    <>
      <ToggleTrack
        on={checked}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled ?? false}
        onClick={request}
      >
        <ToggleThumb on={checked} />
      </ToggleTrack>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: "0.8rem", letterSpacing: "0.12em" }}>
          {blocked ? "ACTION BLOCKED" : "CONFIRM POWER CHANGE"}
        </DialogTitle>
        <DialogContent>
          {blocked ? (
            <Alert severity="warning" variant="outlined">
              Cannot turn off this communication link. It is the last remaining active
              communication range.
            </Alert>
          ) : (
            <DialogContentText sx={{ fontSize: "0.75rem" }}>
              Are you sure you want to turn this communication component{" "}
              {checked ? "OFF" : "ON"}? ({label})
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button size="small" color="inherit" onClick={() => setOpen(false)}>
            {blocked ? "Close" : "Cancel"}
          </Button>
          {!blocked && (
            <Button size="small" variant="contained" onClick={accept}>
              Confirm
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
