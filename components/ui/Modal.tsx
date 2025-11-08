"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { PropsWithChildren } from "react";

type ModalProps = PropsWithChildren<{
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}>;

const sizeMap: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({ open, onOpenChange, title, description, children, size = "md" }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm data-[state=open]:animate-fadeIn" />
        <Dialog.Content
          className={`fixed left-1/2 top-1/2 w-[95vw] ${sizeMap[size]} -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl focus:outline-none data-[state=open]:animate-scaleIn`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              {title && (
                <Dialog.Title className="text-lg font-semibold tracking-tight text-gray-900">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="mt-1 text-sm text-gray-600">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close
              aria-label="Cerrar"
              className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
            >
              <X size={18} />
            </Dialog.Close>
          </div>
          <div className="mt-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;
