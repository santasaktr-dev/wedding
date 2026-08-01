import Link from "next/link";

import { getPublicGalleryAlbums } from "../../lib/cms/server";
import { GalleryLightbox } from "../components/GalleryLightbox";

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ lang?: string; album?: string }> }) {
  const albums = await getPublicGalleryAlbums();
  const query = await searchParams;
  const language = query.lang === "th" ? "th" : "en";
  const isThai = language === "th";
  const visibleAlbums = albums.filter((album) => album.images.length > 0);
  const selectedAlbum = query.album ? visibleAlbums.find((album) => album.slug === query.album) : undefined;
  const galleryHref = (album?: string, targetLanguage = language) => {
    const params = new URLSearchParams();
    if (album) params.set("album", album);
    if (targetLanguage === "th") params.set("lang", "th");
    const value = params.toString();
    return value ? `/gallery?${value}` : "/gallery";
  };

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
              href={galleryHref(selectedAlbum?.slug, isThai ? "en" : "th")}
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
            {selectedAlbum ? (
              <Link
                className="mt-5 inline-flex min-h-12 items-center rounded-full border border-[#0A1F44]/20 px-4 text-sm font-semibold text-[#0A1F44] transition hover:border-[#0A1F44] hover:bg-white"
                href="/#gallery"
              >
                {isThai ? "← กลับหน้าแรก" : "← Back to home"}
              </Link>
            ) : null}
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

          {selectedAlbum ? (
            <section className="mt-10">
              <div className="flex flex-col gap-3 border-b border-[#0A1F44]/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C5C3B]">{selectedAlbum.label[language] || selectedAlbum.label.en}</p>
                  <h2 className="luxury-heading mt-2 text-3xl font-semibold sm:text-4xl">{selectedAlbum.title[language] || selectedAlbum.title.en}</h2>
                  <p className="mt-3 max-w-2xl leading-7 text-[#0A1F44]/68">{selectedAlbum.description[language] || selectedAlbum.description.en}</p>
                </div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#7C5C3B]">{selectedAlbum.images.length} {isThai ? "รูป" : "photos"}</p>
              </div>
              {selectedAlbum.images.length > 0 ? (
                <div className="mt-8">
                  <GalleryLightbox
                    testId={`gallery-masonry-${selectedAlbum.slug}`}
                    images={selectedAlbum.images.map((image) => ({
                      id: image.id,
                      src: image.publicUrl,
                      thumbnailSrc: image.publicUrl,
                      alt: image.alt[language] || image.alt.en,
                      caption: image.caption[language] || image.caption.en,
                    }))}
                  />
                </div>
              ) : <p className="mt-8 border border-dashed border-[#D6C8A5] bg-white p-5 text-[#0A1F44]/65">{isThai ? "อัลบั้มนี้กำลังเตรียมรูปอยู่" : "Photos for this album are being prepared."}</p>}
            </section>
          ) : (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleAlbums.map((album) => {
                const cover = album.images.find((image) => image.id === album.coverImageId) ?? album.images[0];
                return (
                  <Link className="group overflow-hidden rounded-[1.25rem] border border-[#0A1F44]/10 bg-white shadow-[0_14px_40px_rgba(10,31,68,0.08)] transition hover:-translate-y-0.5 hover:border-[#7C5C3B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7C5C3B]" href={galleryHref(album.slug)} key={album.id}>
                    <div className="relative aspect-[4/3] bg-[#0A1F44]/8">
                      {cover ? <img alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" src={cover.publicUrl} /> : <div className="grid h-full place-items-center text-sm font-semibold text-[#0A1F44]/45">{isThai ? "กำลังเตรียมรูป" : "Photos coming soon"}</div>}
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7C5C3B]">{album.label[language] || album.label.en}</p>
                      <h2 className="luxury-heading mt-2 text-2xl font-semibold">{album.title[language] || album.title.en}</h2>
                      <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-[#0A1F44]/65">{album.description[language] || album.description.en}</p>
                      <span className="mt-5 flex min-h-10 items-center justify-between border-t border-[#0A1F44]/10 pt-4 text-sm font-semibold text-[#0A1F44]"><span>{album.images.length} {isThai ? "รูป" : "photos"}</span><span aria-hidden="true">→</span></span>
                    </div>
                  </Link>
                );
              })}
              {visibleAlbums.length === 0 ? <p className="border border-dashed border-[#D6C8A5] bg-white p-5 text-[#0A1F44]/65">{isThai ? "กำลังเตรียมอัลบั้มรูป" : "Albums are being prepared."}</p> : null}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
