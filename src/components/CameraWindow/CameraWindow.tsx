import { useState, type MouseEvent } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import roadFeed from "@/assets/road-feed.jpg";
import {
  Backdrop,
  CloseButton,
  FeedFooter,
  FeedImage,
  HeaderSpacer,
  QualityButton,
  WindowFrame,
  WindowHeader,
} from "./CameraWindow.styles";

export type FeedQuality = "H" | "M" | "L";

const QUALITIES: FeedQuality[] = ["H", "M", "L"];

export interface CameraWindowProps {
  title: string;
  open: boolean;
  onClose: () => void;
}

export function CameraWindow({ title, open, onClose }: CameraWindowProps) {
  const [quality, setQuality] = useState<FeedQuality>("H");
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  if (!open) return null;

  const openMenu = (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget);
  const pick = (value: FeedQuality) => {
    setQuality(value);
    setAnchor(null);
  };

  return (
    <Backdrop onClick={onClose} role="presentation">
      <WindowFrame
        role="dialog"
        aria-label={`${title} camera feed`}
        onClick={(event) => event.stopPropagation()}
      >
        <WindowHeader>
          {title} · ROAD SIM
          <HeaderSpacer />
          <QualityButton onClick={openMenu} aria-label="Feed quality">
            {quality}
          </QualityButton>
          <CloseButton onClick={onClose} aria-label="Close camera window">
            <CloseIcon />
          </CloseButton>
        </WindowHeader>

        <FeedImage src={roadFeed} alt={`${title} simulated road view`} width={1024} height={640} />

        <FeedFooter>
          <span>LIVE SIMULATION</span>
          <span>QUALITY {quality}</span>
        </FeedFooter>

        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          {QUALITIES.map((value) => (
            <MenuItem key={value} selected={value === quality} onClick={() => pick(value)}>
              {value}
            </MenuItem>
          ))}
        </Menu>
      </WindowFrame>
    </Backdrop>
  );
}
