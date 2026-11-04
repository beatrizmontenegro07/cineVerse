'use client';

import { useEffect, useRef } from 'react';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';

import { Icon } from './icon';

interface ModalProps {
  titleId: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ titleId, children, onClose }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pointerStartedOutside = useRef(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  function isOutside(event: MouseEvent<HTMLDialogElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    );
  }

  function keepFocusInside(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const controls = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => {
      if (!element.getClientRects().length || element.matches(':disabled'))
        return false;
      if (element instanceof HTMLInputElement && element.type === 'radio') {
        const group = Array.from(
          event.currentTarget.querySelectorAll<HTMLInputElement>(
            'input[type="radio"]',
          ),
        ).filter(
          (radio) => radio.name === element.name && !radio.matches(':disabled'),
        );
        return element === (group.find((radio) => radio.checked) ?? group[0]);
      }
      return true;
    });
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onKeyDown={keepFocusInside}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onPointerDown={(event) => {
        pointerStartedOutside.current =
          event.target === event.currentTarget && isOutside(event);
      }}
      onClick={(event) => {
        if (
          pointerStartedOutside.current &&
          event.target === event.currentTarget &&
          isOutside(event)
        )
          onClose();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto overscroll-contain rounded-2xl border border-[#665078] bg-[#0c0a11] p-3 text-[#f7f5fb] shadow-[0_24px_100px_#0009,0_0_50px_#a36aff15] backdrop:bg-[#07050dd9] backdrop:backdrop-blur-sm sm:p-5"
    >
      <div className="relative rounded-xl border border-[#43334f] bg-[linear-gradient(125deg,#17121f,#100e17)] p-5 sm:p-7">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar detalhes do filme"
          className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-lg border border-white/8 bg-[#2c2237] text-[#d5cce1] transition hover:border-accent/50 hover:bg-[#3d2c50] hover:text-white sm:top-4 sm:right-4"
        >
          <Icon name="close" className="size-5" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
