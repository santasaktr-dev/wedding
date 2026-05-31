import Image from "next/image";
import Link from "next/link";

const albums = [
  {
    id: "prewedding-highlights",
    label: "Prewedding",
    title: "Highlights",
    description: "A curated first look at the prewedding mood.",
    images: [
      {
        src: "/images/wedding-hero.png",
        alt: "Prewedding portrait of Jajah and Smart",
        caption: "Classic Portrait",
      },
      {
        src: "/images/wedding-hero.png",
        alt: "Elegant prewedding moment of Jajah and Smart",
        caption: "Refined Moment",
      },
      {
        src: "/images/wedding-hero.png",
        alt: "Timeless prewedding styling for Jajah and Smart",
        caption: "Old Money Mood",
      },
      {
        src: "/images/wedding-hero.png",
        alt: "Romantic prewedding detail of Jajah and Smart",
        caption: "Soft Detail",
      },
    ],
  },
  {
    id: "studio-set",
    label: "Prewedding",
    title: "Studio Set",
    description: "Polished portraits with a formal, timeless feeling.",
    images: [
      {
        src: "/images/wedding-hero.png",
        alt: "Studio prewedding portrait of Jajah and Smart",
        caption: "Formal Portrait",
      },
      {
        src: "/images/wedding-hero.png",
        alt: "Studio prewedding styling detail",
        caption: "Tailored Detail",
      },
    ],
  },
  {
    id: "outdoor-set",
    label: "Prewedding",
    title: "Outdoor Set",
    description: "Softer scenes for a warm and natural album.",
    images: [
      {
        src: "/images/wedding-hero.png",
        alt: "Outdoor prewedding moment of Jajah and Smart",
        caption: "Garden Mood",
      },
      {
        src: "/images/wedding-hero.png",
        alt: "Outdoor prewedding portrait detail",
        caption: "Soft Light",
      },
    ],
  },
];

export default function GalleryPage() {
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
                id={album.id}
                key={album.id}
              >
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C5C3B]">
                      {album.label}
                    </p>
                    <h2 className="luxury-heading mt-2 text-2xl font-semibold">
                      {album.title}
                    </h2>
                    <p className="mt-3 max-w-2xl leading-7 text-[#0A1F44]/68">
                      {album.description}
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
                      key={`${album.id}-${image.caption}`}
                    >
                      <div className={index === 0 ? "relative aspect-[16/11]" : "relative aspect-[4/5]"}>
                        <Image
                          alt={image.alt}
                          className="object-cover opacity-95 transition duration-500 group-hover:scale-[1.03]"
                          fill
                          sizes={index === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                          src={image.src}
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A1F44]/85 to-transparent p-4 pt-14">
                          <figcaption className="luxury-heading text-xs font-semibold text-[#D6C8A5]">
                            {image.caption}
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
