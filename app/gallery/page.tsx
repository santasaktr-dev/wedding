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
      <header className="border-b border-[#0A1F44]/10 bg-[#FBF8F0]/90 px-4 py-3.5 backdrop-blur sm:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between" aria-label="Gallery navigation">
          <Link
            aria-label={isThai ? "กลับเว็บไซต์" : "Back to website"}
            className="gallery-brand-link script-display text-2xl font-semibold leading-none transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7C5C3B]"
            href="/#gallery"
          >
            J&S
          </Link>
          <div className="ml-auto flex items-center gap-3" data-testid="gallery-header-actions">
            <Link
              className="rounded-full px-2.5 py-2 text-xs font-semibold tracking-[0.08em] text-[#0A1F44]/65 transition hover:bg-[#D6C8A5]/20 hover:text-[#7C5C3B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C5C3B] sm:text-sm"
              href={isThai ? "/gallery" : "/gallery?lang=th"}
            >
              {isThai ? "EN" : "ไทย"}
            </Link>
          </div>
        </nav>
      </header>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <nav aria-label={isThai ? "เส้นทางหน้า" : "Breadcrumb"} className="text-xs font-semibold tracking-[0.08em] text-[#0A1F44]/50" data-testid="gallery-breadcrumb">
              <Link className="transition-colors hover:text-[#7C5C3B]" href="/#gallery">
                J&amp;S
              </Link>
              <span className="px-2 text-[#7C5C3B]/65">/</span>
              <span>{isThai ? "แกลเลอรี" : "Gallery"}</span>
            </nav>
          </div>

          <div className="grid items-end gap-8 border-b border-[#0A1F44]/10 pb-12 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#7C5C3B]">
                {isThai ? "แกลเลอรี" : "Gallery"}
              </p>
              <h1 className="luxury-heading max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
                {isThai ? "อัลบั้มของ Jajah & Smart" : "Jajah & Smart Albums"}
              </h1>
            </div>
            <p className="max-w-xl text-base leading-8 text-[#0A1F44]/70 md:justify-self-end md:text-lg">
              {isThai ? "รวมภาพพรีเวดดิ้งของเรา และสามารถเพิ่มอัลบั้มวันงานได้หลังจบการเฉลิมฉลอง" : "A fuller collection of prewedding images. Wedding day albums can be added here after the celebration."}
            </p>
          </div>

          <div className="mt-14 space-y-16">
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
