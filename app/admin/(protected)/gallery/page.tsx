import { getAdminGalleryAlbums } from "../../../../lib/cms/server";
import { GalleryManager } from "../../components/GalleryManager";

export default async function GalleryPage() {
  const albums = await getAdminGalleryAlbums();
  const galleryStateKey = albums
    .map((album) => `${album.id}:${album.images.map((image) => image.id).join(",")}`)
    .join("|");

  return <GalleryManager initialAlbums={albums} key={galleryStateKey} />;
}
