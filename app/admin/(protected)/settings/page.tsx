import Link from "next/link";

import { publishDraftContentFromForm } from "../../../../lib/cms/actions";

export default function SettingsPage() {
  return (
    <section className="border border-[#d6c8a5] bg-[#fffdf7] p-6 shadow-[0_18px_50px_rgba(10,31,68,0.08)] sm:p-8">
      <p className="luxury-heading text-xs font-semibold text-[#7c5c3b]">Settings</p>
      <h2 className="mt-3 text-2xl font-semibold text-[#0a1f44]">Publish</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#3e4d3a]">
        Save content and gallery changes as draft first. Publish only when the draft is ready for
        guests.
      </p>

      <form action={publishDraftContentFromForm} className="mt-6">
        <button
          className="min-h-12 bg-[#0a1f44] px-5 text-sm font-semibold text-[#fbf8f0] transition hover:bg-[#142f5f]"
          type="submit"
        >
          Publish draft
        </button>
      </form>

      <Link
        className="mt-5 inline-flex border border-[#d6c8a5] bg-white px-4 py-3 text-sm font-semibold text-[#0a1f44] transition hover:border-[#0a1f44]"
        href="/preview"
      >
        Preview full page
      </Link>
    </section>
  );
}
