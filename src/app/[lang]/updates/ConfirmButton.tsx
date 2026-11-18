"use client";

import { useFormStatus } from "react-dom";

export function ConfirmButton({ label, sendingLabel }: { label: string; sendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 rounded-full border border-navy-700 px-4 py-1.5 text-sm font-medium text-navy-800 hover:bg-navy-50 disabled:opacity-60"
    >
      {pending ? sendingLabel : label}
    </button>
  );
}
