"use client";

import { styled, GetProps } from "tamagui";
import { useEffect, useState } from "react";

const SheetOverlay = styled("div", {
  name: "SheetOverlay",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 999,
  opacity: 0,
  transition: "opacity 0.3s ease",

  variants: {
    open: {
      true: {
        opacity: 1,
      },
    },
  } as const,
});

const SheetContent = styled("div", {
  name: "SheetContent",
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "$surface",
  borderTopLeftRadius: "$xl",
  borderTopRightRadius: "$xl",
  maxHeight: "85vh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  zIndex: 1000,
  transform: "translateY(100%)",
  transition: "transform 0.3s ease",

  variants: {
    open: {
      true: {
        transform: "translateY(0)",
      },
    },
  } as const,
});

const SheetHandle = styled("div", {
  name: "SheetHandle",
  width: 40,
  height: 4,
  backgroundColor: "$border",
  borderRadius: "$full",
  marginHorizontal: "auto",
  marginVertical: "$3",
  flexShrink: 0,
});

const SheetHeader = styled("div", {
  name: "SheetHeader",
  paddingHorizontal: "$4",
  paddingVertical: "$3",
  borderBottomWidth: 1,
  borderBottomColor: "$border",
  flexShrink: 0,
});

const SheetBody = styled("div", {
  name: "SheetBody",
  flex: 1,
  overflowY: "auto",
  paddingHorizontal: "$4",
  paddingVertical: "$4",
});

const SheetFooter = styled("div", {
  name: "SheetFooter",
  paddingHorizontal: "$4",
  paddingVertical: "$4",
  borderTopWidth: 1,
  borderTopColor: "$border",
  flexShrink: 0,
});

export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function Sheet({ open = false, onOpenChange, children }: SheetProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onOpenChange?.(false);
  };

  if (!isOpen && !open) return null;

  return (
    <>
      <SheetOverlay open={isOpen} onClick={handleClose} />
      <SheetContent open={isOpen}>{children}</SheetContent>
    </>
  );
}

Sheet.Handle = SheetHandle;
Sheet.Header = SheetHeader;
Sheet.Body = SheetBody;
Sheet.Footer = SheetFooter;

export type SheetProps_2 = GetProps<typeof Sheet>;
