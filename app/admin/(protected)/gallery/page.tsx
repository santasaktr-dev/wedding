import { fallbackCmsSnapshot } from "../../../../lib/cms/fallback";
import { GalleryManager } from "../../components/GalleryManager";

export default function GalleryPage() {
  return <GalleryManager initialAlbums={fallbackCmsSnapshot.albums} />;
}
