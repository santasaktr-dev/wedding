import Image from "next/image";
import Link from "next/link";

import { getPublicGalleryAlbums } from "../../lib/cms/server";

export default async function GalleryPage() {
  const albums = await getPublicGalleryAlbums();

  return (
    <main className="subtle-paper min-h-screen bg-[#FBF8F0] text-[#0A1F44]">
      <header className="border-b border-[#0A1F44]/10 bg-[#FBF8F0]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between" aria-label="Gallery navigation">
          <Link className="luxury-heading text-lg font-semibold" href="/">
            J&S
          </Link>
          <Link
            className="inline-flex min-h-10 items-center rounded border border-[#0A1F44]/15 px-4 text-sm font-bold uppercase tracking-[0.12em] transition hover:border-[#7C5C3B] hover:text-[#7C5C3B]"
            href="/#gallery"
          >
            Back
          </Link>
        </nav>
      </header>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#7C5C3B]">
              Gallery
            </p>
            <h1 className="luxury-heading text-4xl font-semibold leading-tight md:text-5xl">
              Jajah & Smart Albums
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#0A1F44]/70">
              A fuller collection of prewedding images. Wedding day albums can be added here after the celebration.
            </p>
          </div>

          <div className="mt-12 space-y-14">
            {albums.map((album) => (
              <section
                className="border-t border-[#0A1F44]/10 pt-8"
                id={album.slug}
                key={album.id}
              >
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C5C3B]">
                      {album.label.en}
                    </p>
                    <h2 className="luxury-heading mt-2 text-2xl font-semibold">
                      {album.title.en}
                    </h2>
                    <p className="mt-3 max-w-2xl leading-7 text-[#0A1F44]/68">
                      {album.description.en}
                    </p>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#7C5C3B]">
                    {album.images.length} photos
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {album.images.map((image, index) => (
                    <figure
                      className={`group overflow-hidden rounded border border-[#0A1F44]/10 bg-[#0A1F44] shadow-[0_18px_50px_rgba(10,31,68,0.12)] ${
                        index === 0 ? "lg:col-span-2" : ""
                      }`}
                      key={image.id}
                    >
                      <div className={index === 0 ? "relative aspect-[16/11]" : "relative aspect-[4/5]"}>
                        <Image
                          alt={image.alt.en}
                          className="object-cover opacity-95 transition duration-500 group-hover:scale-[1.03]"
                          fill
                          sizes={index === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                          src={image.publicUrl}
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A1F44]/85 to-transparent p-4 pt-14">
                          <figcaption className="luxury-heading text-xs font-semibold text-[#D6C8A5]">
                            {image.caption.en}
                          </figcaption>
                        </div>
                      </div>
                    </figure>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
