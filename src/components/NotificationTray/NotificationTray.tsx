import { useState } from "react";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { notifications } from "@/data/notifications";
import type { AlertNotification } from "@/data/notifications";
import { ItemDetail, ItemTitle, TrayButton, TrayItem, TrayList } from "./NotificationTray.styles";

export interface NotificationTrayProps {
  items?: AlertNotification[];
}

/** Bell with an alert count; opens the alert list beneath it. */
export function NotificationTray({ items = notifications }: NotificationTrayProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <TrayButton
        aria-label={`Notifications (${items.length})`}
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        <Badge badgeContent={items.length} color="error">
          <NotificationsIcon />
        </Badge>
      </TrayButton>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <TrayList>
          {items.map((item) => (
            <TrayItem key={item.id} severity={item.severity}>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemDetail>
                <span>{item.detail}</span>
                <span>{item.time}</span>
              </ItemDetail>
            </TrayItem>
          ))}
        </TrayList>
      </Popover>
    </>
  );
}
