/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { getPublicGalleryAlbums } from "../../lib/cms/server";
import { GalleryLightbox } from "../components/GalleryLightbox";

export default async function GalleryPage({ searchParams = Promise.resolve({}) }: { searchParams?: Promise<{ lang?: string }> } = {}) {
  const albums = await getPublicGalleryAlbums();
  const language = (await searchParams).lang === "th" ? "th" : "en";
  const isThai = language === "th";

  return (
    <main
      className={`subtle-paper min-h-screen bg-[#FBF8F0] text-[#0A1F44] ${isThai ? "lang-th" : ""}`}
      lang={isThai ? "th" : "en"}
      style={isThai ? { fontFamily: "var(--font-kanit), ui-sans-serif, system-ui, sans-serif" } : undefined}
    >
      <header className="border-b border-[#0A1F44]/10 bg-[#FBF8F0]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between" aria-label="Gallery navigation">
          <Link className="script-display text-2xl font-semibold leading-none" href="/">
            J&S
          </Link>
          <div className="ml-auto flex items-center gap-2" data-testid="gallery-header-actions">
            <Link
              className="inline-flex min-h-10 items-center rounded border border-[#0A1F44]/15 px-3 text-sm font-bold uppercase tracking-[0.12em] transition hover:border-[#7C5C3B] hover:text-[#7C5C3B] sm:px-4"
              href="/#gallery"
            >
              {isThai ? "กลับหน้าแรก" : "Back"}
            </Link>
            <Link className="px-2 text-sm font-semibold" href={isThai ? "/gallery" : "/gallery?lang=th"}>
              {isThai ? "EN" : "ไทย"}
            </Link>
          </div>
        </nav>
      </header>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#7C5C3B]">
              {isThai ? "แกลเลอรี" : "Gallery"}
            </p>
            <h1 className="luxury-heading text-4xl font-semibold leading-tight md:text-5xl">
              {isThai ? "อัลบั้มของ Jajah & Smart" : "Jajah & Smart Albums"}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#0A1F44]/70">
              {isThai ? "รวมภาพพรีเวดดิ้งของเรา และสามารถเพิ่มอัลบั้มวันงานได้หลังจบการเฉลิมฉลอง" : "A fuller collection of prewedding images. Wedding day albums can be added here after the celebration."}
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
                      {album.label[language] || album.label.en}
                    </p>
                    <h2 className="luxury-heading mt-2 text-2xl font-semibold">
                      {album.title[language] || album.title.en}
                    </h2>
                    <p className="mt-3 max-w-2xl leading-7 text-[#0A1F44]/68">
                      {album.description[language] || album.description.en}
                    </p>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#7C5C3B]">
                    {album.images.length} {isThai ? "รูป" : "photos"}
                  </p>
                </div>

                <GalleryLightbox testId={`gallery-masonry-${album.slug}`} images={album.images.map((image) => ({ id: image.id, src: image.publicUrl, alt: image.alt[language] || image.alt.en, caption: image.caption[language] || image.caption.en }))} />
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
