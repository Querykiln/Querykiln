import { useState } from "react";

export default function useMobileSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return {
    mobileOpen,
    openMobile: () => setMobileOpen(true),
    closeMobile: () => setMobileOpen(false),
  };
}
