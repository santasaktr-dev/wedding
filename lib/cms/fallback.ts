import type { CmsSnapshot } from "./types";

const weddingHeroImage = "/images/wedding-hero.png";

export const fallbackCmsSnapshot: CmsSnapshot = {
  id: "fallback-published",
  status: "published",
  updatedAt: "2026-07-07T00:00:00.000Z",
  publishedAt: "2026-07-07T00:00:00.000Z",
  content: {
    hero: {
      coupleName: "Jajah & Smart",
      date: {
        en: "Sunday, 1 November 2026",
        th: "วันอาทิตย์ที่ 1 พฤศจิกายน 2569",
      },
      text: {
        en: "Together with their families request the pleasure of your company at the celebration of their wedding at Pearl Wedding Venue.",
        th: "เรียนเชิญร่วมเป็นเกียรติในงานฉลองมงคลสมรสของ Jajah & Smart ณ Pearl Wedding Venue",
      },
      imageSrc: weddingHeroImage,
      imageAlt: {
        en: "Elegant wedding venue with refined old money styling",
        th: "บรรยากาศงานแต่งงานสไตล์ Old Money ที่เรียบหรู",
      },
      locationButton: {
        en: "View Location",
        th: "ดูแผนที่",
      },
      dressButton: {
        en: "Dress Code",
        th: "ธีมการแต่งกาย",
      },
    },
    eventInfo: {
      eyebrow: {
        en: "Event Info",
        th: "ข้อมูลสำคัญ",
      },
      title: {
        en: "The Celebration",
        th: "รายละเอียดงาน",
      },
      intro: {
        en: "A concise guide to the date, arrival time, venue, and overall style of the wedding day.",
        th: "สรุปวัน เวลา สถานที่ และธีมงาน เพื่อให้แขกเตรียมตัวได้อย่างสะดวก",
      },
      cards: [
        {
          id: "date",
          label: { en: "Date", th: "วันที่" },
          value: {
            en: "Sunday, 1 November 2026",
            th: "วันอาทิตย์ที่ 1 พฤศจิกายน 2569",
          },
        },
        {
          id: "time",
          label: { en: "Time", th: "เวลา" },
          value: { en: "To be confirmed", th: "รอยืนยันเวลา" },
        },
        {
          id: "venue",
          label: { en: "Venue", th: "สถานที่" },
          value: { en: "Pearl Wedding Venue", th: "Pearl Wedding Venue" },
        },
        {
          id: "dress",
          label: { en: "Dress Code", th: "ธีมชุด" },
          value: { en: "Old Money Elegance", th: "Old Money Elegance" },
        },
      ],
    },
    schedule: {
      eyebrow: {
        en: "Schedule",
        th: "กำหนดการ",
      },
      title: {
        en: "Wedding Day Timeline",
        th: "ลำดับพิธี",
      },
      intro: {
        en: "The final timeline is being confirmed. Please check back closer to the wedding date for the exact arrival and ceremony times.",
        th: "กำหนดการและเวลางานโดยละเอียดอยู่ระหว่างการยืนยัน และจะอัปเดตอีกครั้งเมื่อใกล้วันงาน",
      },
      items: [
        {
          id: "registration",
          time: "TBC",
          title: { en: "Guest Registration", th: "ลงทะเบียน" },
          detail: { en: "Welcome and arrival", th: "ต้อนรับแขกและลงทะเบียน" },
          sortOrder: 0,
        },
        {
          id: "ceremony",
          time: "TBC",
          title: { en: "Wedding Ceremony", th: "พิธีแต่งงาน" },
          detail: { en: "Ceremony begins", th: "เริ่มพิธีมงคลสมรส" },
          sortOrder: 1,
        },
        {
          id: "reception",
          time: "TBC",
          title: { en: "Dinner Reception", th: "งานเลี้ยงฉลอง" },
          detail: { en: "Dinner and reception", th: "รับประทานอาหารและร่วมฉลอง" },
          sortOrder: 2,
        },
        {
          id: "toast",
          time: "TBC",
          title: { en: "Toast & Celebration", th: "กล่าวอวยพร" },
          detail: { en: "Toasts and celebration", th: "ช่วงอวยพรและเฉลิมฉลอง" },
          sortOrder: 3,
        },
      ],
    },
    location: {
      eyebrow: {
        en: "Location",
        th: "สถานที่",
      },
      title: {
        en: "Pearl Wedding Venue",
        th: "Pearl Wedding Venue",
      },
      intro: {
        en: "Pearl Wedding Venue is located on Borommaratchachonnani Road outbound, between Phutthamonthon Sai 2 and Sai 3.",
        th: "สถานที่ตั้งอยู่ติดถนนบรมราชชนนีฝั่งขาออก ช่วงระหว่างพุทธมณฑลสาย 2 และพุทธมณฑลสาย 3",
      },
      address: {
        en: "Pearl Wedding Venue, Borommaratchachonnani Road, Bangkok",
        th: "Pearl Wedding Venue, ถนนบรมราชชนนี, กรุงเทพฯ",
      },
      parkingNote: {
        en: "Please allow extra travel time and follow the Google Maps route to the venue.",
        th: "กรุณาเผื่อเวลาเดินทาง และสามารถกด Google Maps เพื่อนำทางมายังสถานที่",
      },
      mapsUrl: "https://maps.app.goo.gl/XwnnwTVqNXy3SNzSA",
      mapsEmbedUrl: "https://www.google.com/maps?q=Pearl%20Wedding%20Venue%20Borommaratchachonnani&output=embed",
      mapsButton: {
        en: "Open Google Maps",
        th: "เปิด Google Maps",
      },
      contactButton: {
        en: "Contact Smart",
        th: "ติดต่อ Smart",
      },
      transportTitle: {
        en: "Getting There",
        th: "การเดินทาง",
      },
      transportSections: [
        {
          id: "driving",
          title: { en: "Driving", th: "การเดินทางโดยรถยนต์ส่วนตัว" },
          items: [
            {
              en: "The venue is on Borommaratchachonnani Road outbound toward Nakhon Pathom, between Phutthamonthon Sai 2 and Sai 3.",
              th: "สถานที่ตั้งอยู่ติดถนนบรมราชชนนี ฝั่งขาออก มุ่งหน้านครปฐม ช่วงระหว่างพุทธมณฑลสาย 2 และพุทธมณฑลสาย 3",
            },
            {
              en: "Landmarks include Soi Borommaratchachonnani 72 and the entrance to Krisdanakorn Village. Look for the modern round glasshouse building by the main road.",
              th: "จุดสังเกตคืออยู่ใกล้ซอยบรมราชชนนี 72 และทางเข้าหมู่บ้านกฤษดานคร ตัวอาคารเป็นกระจกทรงกลมสไตล์โมเดิร์น มองเห็นได้ง่ายจากริมถนนใหญ่",
            },
          ],
          sortOrder: 0,
        },
        {
          id: "public-transportation",
          title: { en: "Public Transportation", th: "การเดินทางโดยระบบขนส่งสาธารณะ" },
          items: [
            {
              en: "MRT Lak Song or BTS Bang Wa, then continue by taxi toward Borommaratchachonnani Road outbound.",
              th: "สามารถนั่ง MRT มาลงสถานีหลักสอง หรือ BTS มาลงสถานีบางหว้า แล้วต่อรถแท็กซี่เข้าสู่ถนนบรมราชชนนีฝั่งขาออก",
            },
            {
              en: 'Bus routes 515 and 556 pass nearby. Ask to get off at "Krisdanakorn Village" bus stop, then walk or take a motorcycle taxi to the venue.',
              th: 'รถเมล์สาย 515 และ 556 วิ่งผ่าน สามารถแจ้งพนักงานเก็บค่าโดยสารว่าลงที่ "ป้ายหมู่บ้านกฤษดานคร" จากนั้นเดินต่อหรือต่อมอเตอร์ไซค์รับจ้างเข้าสู่อาคารจัดงาน',
            },
          ],
          sortOrder: 1,
        },
      ],
    },
    dressCode: {
      eyebrow: {
        en: "Dress Code",
        th: "ธีมการแต่งกาย",
      },
      title: {
        en: "Old Money Elegance",
        th: "Old Money Elegance",
      },
      intro: {
        en: "Refined, timeless tones inspired by classic tailoring and understated luxury. Choose polished silhouettes, soft textures, and minimal details that feel formal without being ornate.",
        th: "ขอเชิญแต่งกายในโทนสุภาพ เรียบหรู และคลาสสิก เลือกทรงชุดที่ดูประณีต รายละเอียดน้อย และเหมาะกับบรรยากาศงานช่วงเย็น",
      },
      keywords: [
        { en: "Tailored", th: "สุภาพ" },
        { en: "Timeless", th: "คลาสสิก" },
        { en: "Minimal", th: "เรียบหรู" },
      ],
      paletteTitle: {
        en: "Suggested Palette",
        th: "โทนสีแนะนำ",
      },
      colors: [
        { name: "Oxford Navy", hex: "#0A1F44" },
        { name: "Tweed Brown", hex: "#7C5C3B" },
        { name: "Deep Olive", hex: "#3E4D3A" },
        { name: "Camel Beige", hex: "#D6C8A5" },
        { name: "Ash Grey", hex: "#BDBFBA" },
      ],
    },
    rsvp: {
      eyebrow: {
        en: "RSVP",
        th: "ตอบรับคำเชิญ",
      },
      title: {
        en: "Kindly Confirm Your Attendance",
        th: "กรุณายืนยันการเข้าร่วมงาน",
      },
      intro: {
        en: "Please confirm your attendance by 30 September 2026. Your response helps us prepare the celebration beautifully for everyone.",
        th: "กรุณายืนยันการเข้าร่วมงานภายในวันที่ 30 กันยายน 2569 เพื่อให้เราจัดเตรียมงานได้อย่างเหมาะสมและสวยงามสำหรับทุกคน",
      },
      note: {
        en: "",
        th: "",
      },
      deadline: "2026-09-30",
    },
    gallery: {
      eyebrow: {
        en: "Gallery",
        th: "แกลเลอรี",
      },
      title: {
        en: "Prewedding Moments",
        th: "ภาพพรีเวดดิ้ง",
      },
      intro: {
        en: "A quiet preview of the celebration, styled with the same refined and timeless mood as the wedding day.",
        th: "พรีวิวบรรยากาศอบอุ่น เรียบหรู และคลาสสิกในโทนเดียวกับวันงาน",
      },
      cta: {
        en: "View Full Gallery",
        th: "ดูแกลเลอรีทั้งหมด",
      },
      albumLabel: {
        en: "Albums",
        th: "อัลบั้ม",
      },
      photoCountLabel: {
        en: "photos",
        th: "รูป",
      },
      comingSoon: {
        en: "Wedding day photos will be added after the celebration.",
        th: "ภาพวันงานจะเพิ่มหลังจบงานแต่งงาน",
      },
    },
    faq: {
      eyebrow: {
        en: "FAQ",
        th: "FAQ",
      },
      title: {
        en: "Guest Notes",
        th: "คำถามที่พบบ่อย",
      },
      items: [
        {
          id: "rsvp-deadline",
          question: {
            en: "When should I RSVP?",
            th: "ควรตอบรับคำเชิญภายในวันไหน?",
          },
          answer: {
            en: "Please submit your RSVP by 30 September 2026.",
            th: "กรุณาส่งคำตอบ RSVP ภายในวันที่ 30 กันยายน 2569",
          },
          sortOrder: 0,
        },
        {
          id: "timeline-final",
          question: {
            en: "Is the wedding timeline final?",
            th: "กำหนดการงาน final แล้วหรือยัง?",
          },
          answer: {
            en: "The date and venue are confirmed. The detailed event time and schedule will be updated once finalized.",
            th: "วันและสถานที่ยืนยันแล้ว ส่วนเวลางานและกำหนดการโดยละเอียดจะอัปเดตอีกครั้งเมื่อ final",
          },
          sortOrder: 1,
        },
        {
          id: "venue-directions",
          question: {
            en: "How should I get to the venue?",
            th: "เดินทางไปสถานที่อย่างไร?",
          },
          answer: {
            en: "Please use the Google Maps link on this page. The venue is on Borommaratchachonnani Road outbound, between Phutthamonthon Sai 2 and Sai 3.",
            th: "สามารถกด Google Maps บนหน้าเว็บเพื่อนำทางไป Pearl Wedding Venue ซึ่งตั้งอยู่บนถนนบรมราชชนนีฝั่งขาออก ช่วงระหว่างพุทธมณฑลสาย 2 และสาย 3",
          },
          sortOrder: 2,
        },
        {
          id: "contact",
          question: {
            en: "Who can I contact for questions?",
            th: "ติดต่อใครได้หากมีคำถาม?",
          },
          answer: {
            en: "Please contact Smart via LINE Official or phone.",
            th: "สามารถติดต่อ Smart ผ่าน LINE Official หรือโทรศัพท์",
          },
          sortOrder: 3,
        },
      ],
    },
    contact: {
      eyebrow: {
        en: "Contact",
        th: "ติดต่อ",
      },
      title: {
        en: "Smart",
        th: "Smart",
      },
      intro: {
        en: "For questions about the wedding, location, RSVP, or schedule, please contact Smart via LINE Official or phone.",
        th: "หากมีคำถามเกี่ยวกับงาน สถานที่ RSVP หรือกำหนดการ สามารถติดต่อ Smart ผ่าน LINE Official หรือโทรศัพท์",
      },
      lineLabel: {
        en: "Add LINE Official: @990yroaq",
        th: "เพิ่มเพื่อน LINE Official: @990yroaq",
      },
      lineUrl: "https://line.me/R/ti/p/%40990yroaq",
      phoneLabel: {
        en: "Phone: 099-656-7965",
        th: "Phone: 099-656-7965",
      },
      phoneHref: "tel:+66996567965",
    },
    footer: {
      coupleName: "Jajah & Smart",
      details: {
        en: "1 November 2026 · Pearl Wedding Venue",
        th: "1 November 2026 · Pearl Wedding Venue",
      },
    },
  },
  albums: [
    {
      id: "fallback-highlights",
      slug: "highlights",
      status: "published",
      sortOrder: 0,
      coverImageId: "fallback-highlights-classic-portrait",
      label: {
        en: "Prewedding",
        th: "Prewedding",
      },
      title: {
        en: "Highlights",
        th: "ไฮไลต์",
      },
      description: {
        en: "A curated first look at the prewedding mood.",
        th: "รวมภาพเด่นของบรรยากาศพรีเวดดิ้ง",
      },
      images: [
        {
          id: "fallback-highlights-classic-portrait",
          albumId: "fallback-highlights",
          storagePath: weddingHeroImage,
          publicUrl: weddingHeroImage,
          caption: {
            en: "Classic Portrait",
            th: "ภาพพอร์ตเทรต",
          },
          alt: {
            en: "Prewedding portrait of Jajah and Smart",
            th: "ภาพพรีเวดดิ้งของ Jajah และ Smart",
          },
          sortOrder: 0,
          isCover: true,
          status: "published",
        },
      ],
    },
  ],
};
