import { getPublishedCmsSnapshot } from "../lib/cms/server";
import { fallbackCmsSnapshot } from "../lib/cms/fallback";
import { WeddingHomeClient } from "./components/WeddingHomeClient";

export default async function Home() {
  const snapshot = await getPublishedCmsSnapshot().catch(() => fallbackCmsSnapshot);

  return <WeddingHomeClient snapshot={snapshot} />;
}
