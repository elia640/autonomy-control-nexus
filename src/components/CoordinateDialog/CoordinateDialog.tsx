import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { FieldRow, Hint } from "./CoordinateDialog.styles";

export interface CoordinateDialogProps {
  open: boolean;
  title: string;
  /** Current marker position, in map percentage units. */
  value: { x: number; y: number };
  onClose: () => void;
  onSubmit: (position: { x: number; y: number }) => void;
}

const clamp = (value: number) => Math.max(0, Math.min(100, value));

/** Right-click coordinate entry for the relay and the command post. */
export function CoordinateDialog({ open, title, value, onClose, onSubmit }: CoordinateDialogProps) {
  const [x, setX] = useState(value.x.toFixed(1));
  const [y, setY] = useState(value.y.toFixed(1));

  useEffect(() => {
    if (!open) return;
    setX(value.x.toFixed(1));
    setY(value.y.toFixed(1));
  }, [open, value.x, value.y]);

  const submit = () => {
    const nx = Number.parseFloat(x);
    const ny = Number.parseFloat(y);
    if (Number.isNaN(nx) || Number.isNaN(ny)) return;
    onSubmit({ x: clamp(nx), y: clamp(ny) });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title} · SET COORDINATES</DialogTitle>
      <DialogContent>
        <Hint>Enter the grid position, 0–100 on each axis.</Hint>
        <FieldRow>
          <TextField
            label="EAST (X)"
            size="small"
            value={x}
            onChange={(event) => setX(event.target.value)}
          />
          <TextField
            label="NORTH (Y)"
            size="small"
            value={y}
            onChange={(event) => setY(event.target.value)}
          />
        </FieldRow>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>
          Place
        </Button>
      </DialogActions>
    </Dialog>
  );
}
