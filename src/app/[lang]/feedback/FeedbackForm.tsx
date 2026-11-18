"use client";

import { useActionState } from "react";
import { sendFeedback, type FormState } from "@/app/[lang]/report/actions";
import { getDict, type Locale } from "@/i18n/dictionaries";

const initial: FormState = { ok: false, message: "" };

export function FeedbackForm({ enabled, lang }: { enabled: boolean; lang: Locale }) {
  const t = getDict(lang).feedback;
  const [state, action, pending] = useActionState(sendFeedback, initial);
  return (
    <form action={action} className="space-y-4">
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div>
        <label htmlFor="message" className="font-medium text-navy-900">{t.label}</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={5}
          maxLength={1000}
          rows={5}
          aria-describedby="feedback-help"
          className="mt-1 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-navy-950"
        />
        <p id="feedback-help" className="mt-1 text-xs text-slate-600">{t.help}</p>
      </div>
      <button
        type="submit"
        disabled={pending || !enabled}
        className="min-h-12 rounded-lg bg-navy-900 px-6 py-3 font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
      >
        {pending ? t.sending : t.submit}
      </button>
      <p role="status" aria-live="polite" className={state.ok ? "text-sewa-green" : "text-red-700"}>
        {state.message}
      </p>
    </form>
  );
}
