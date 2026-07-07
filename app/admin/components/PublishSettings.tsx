"use client";

import { useActionState } from "react";

import { publishDraftContentAction } from "../../../lib/cms/actions";
import { StatusBanner } from "./StatusBanner";

export function PublishSettings() {
  const [publishState, publishAction, isPublishing] = useActionState(publishDraftContentAction, { ok: false });

  return (
    <>
      {publishState.message ? (
        <div className="mt-6">
          <StatusBanner tone={publishState.ok ? "success" : "error"}>{publishState.message}</StatusBanner>
        </div>
      ) : null}

      <form action={publishAction} className="mt-6">
        <button
          className="min-h-12 bg-[#0a1f44] px-5 text-sm font-semibold text-[#fbf8f0] transition hover:bg-[#142f5f] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPublishing}
          type="submit"
        >
          {isPublishing ? "Publishing..." : "Publish draft"}
        </button>
      </form>
    </>
  );
}
