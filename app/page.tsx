import { getPublishedCmsSnapshot } from "../lib/cms/server";
import { WeddingHomeClient } from "./components/WeddingHomeClient";

export default async function Home() {
  const snapshot = await getPublishedCmsSnapshot();

  return <WeddingHomeClient snapshot={snapshot} />;
}
