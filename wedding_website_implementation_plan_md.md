# Wedding Website Implementation Plan

เว็บไซต์งานแต่งงานของ **Jajah & Smart**  
วันที่ **1 November 2026**  
สถานที่ **Pearl Wedding Avenue**

ธีมหลัก: **Modern Old Money / Minimal Luxury**  
โทนสี: Oxford Navy, Tweed Brown, Deep Olive, Camel Beige, Ash Grey, Off-white

---

## 1. เป้าหมายของเว็บไซต์

เว็บไซต์นี้ควรทำหน้าที่เป็นศูนย์กลางข้อมูลสำหรับแขกที่มาร่วมงานแต่งงาน โดยสามารถเปิดดูได้ทั้งบนมือถือและ Desktop อย่างสวยงาม ไม่ผิดเพี้ยน และใช้งานง่าย

วัตถุประสงค์หลัก:

1. แสดงข้อมูลสำคัญของงานแต่ง
2. ช่วยให้แขกดูรายละเอียดงานได้ด้วยตัวเอง
3. ลดการตอบคำถามซ้ำผ่านแชตหรือโทรศัพท์
4. ใช้เชื่อมกับ LINE Official / Rich Menu ได้
5. รองรับการ RSVP หรือยืนยันการเข้าร่วมงาน
6. ใช้เป็นพื้นที่รวมรูปภาพ คำอวยพร และข้อมูลหลังงาน

---

## 2. โครงสร้างหน้าเว็บไซต์ที่แนะนำ

เว็บไซต์สามารถทำเป็นแบบ **One-page Website** ได้ เพื่อให้ใช้งานง่ายบนมือถือ แขกสามารถเลื่อนดูข้อมูลทั้งหมดได้ในหน้าเดียว

โครงสร้างที่แนะนำ:

1. Hero Section / หน้าแรก
2. Event Info / ข้อมูลสำคัญของงาน
3. Schedule / กำหนดการ
4. Location / สถานที่จัดงาน
5. Dress Code / ธีมการแต่งกาย
6. RSVP / ยืนยันการเข้าร่วมงาน
7. Wishes / ส่งคำอวยพร
8. Gallery / รูปภาพในงาน
9. Contact / ติดต่อทีมงานหรือเจ้าภาพ
10. FAQ / คำถามที่พบบ่อย
11. Footer / ข้อมูลปิดท้าย

---

## 3. รายละเอียดแต่ละ Section

## 3.1 Hero Section / หน้าแรก

ส่วนนี้เป็นส่วนแรกที่แขกเห็นเมื่อเปิดเว็บไซต์ ควรให้ความรู้สึกเรียบหรู สวยงาม และบอกข้อมูลหลักได้ทันที

ควรมี:

- ชื่อเจ้าบ่าวและเจ้าสาว
- วันที่จัดงาน
- สถานที่
- Mood & Tone ของงาน
- ปุ่มหลัก เช่น “ดูแผนที่”, “ยืนยันเข้าร่วมงาน”, “ดูธีมการแต่งกาย”

ตัวอย่างข้อความ:

```text
SMART & JAJAH
Together with their families
request the pleasure of your company
at the celebration of their wedding

Sunday, 1 November 2026
Pearl Wedding Avenue
```

ปุ่มที่แนะนำ:

- View Location
- RSVP
- Dress Code

---

## 3.2 Event Info / ข้อมูลสำคัญของงาน

แสดงข้อมูลแบบ Card สั้น ๆ เพื่อให้แขกเข้าใจทันที

ควรมี 3–4 Card:

1. Date  
   Sunday, 1 November 2026

2. Time  
   From 16:00 onwards หรือเวลาจริงของงาน

3. Venue  
   Pearl Wedding Avenue

4. Dress Code  
   Old Money Elegance

รูปแบบการแสดงผล:

- Desktop: เรียง 3–4 Card ในแถวเดียว
- Mobile: เรียง Card ลงมาเป็นแนวตั้ง

---

## 3.3 Schedule / กำหนดการ

ใช้แสดง Timeline ของงาน เพื่อให้แขกวางแผนการเดินทางและเวลาได้ง่าย

ตัวอย่างกำหนดการ:

| เวลา | รายการ |
|---|---|
| 16:00 | Guest Registration / ลงทะเบียน |
| 17:00 | Wedding Ceremony / พิธีแต่งงาน |
| 18:30 | Dinner Reception / งานเลี้ยงฉลอง |
| 20:00 | Toast & Celebration / กล่าวอวยพรและเฉลิมฉลอง |

หมายเหตุ: เวลาจริงสามารถปรับตามกำหนดการงานได้

การออกแบบ:

- Desktop: ใช้ Timeline แนวนอนหรือแนวตั้งแบบหรู
- Mobile: ใช้ Timeline แนวตั้ง อ่านง่าย ไม่เบียด

---

## 3.4 Location / สถานที่จัดงาน

Section นี้สำคัญมาก เพราะแขกส่วนใหญ่จะเข้ามาดูเพื่อเดินทางไปงาน

ควรมี:

- ชื่อสถานที่
- ที่อยู่เต็ม
- Google Maps Embed
- ปุ่ม Open in Google Maps
- ปุ่ม Open in Apple Maps ถ้าต้องการ
- รายละเอียดที่จอดรถ
- จุด Drop-off
- คำแนะนำการเดินทาง

ตัวอย่างข้อมูล:

```text
Pearl Wedding Avenue
[ใส่ที่อยู่เต็ม]

Parking available at the venue.
Please arrive 15–30 minutes before the ceremony.
```

ปุ่มที่แนะนำ:

- Open Google Maps
- Call Venue
- Contact Organizer

---

## 3.5 Dress Code / ธีมการแต่งกาย

Section นี้ควรทำให้แขกเข้าใจทันทีว่าควรแต่งตัวแบบไหน โดยไม่ต้องอ่านยาวเกินไป

ธีมหลัก:

```text
Old Money Elegance
```

โทนสีที่แนะนำ:

| สี | Hex | การใช้งาน |
|---|---|---|
| Oxford Navy | #0A1F44 | สีหลัก / สูท / เดรส / ตัวอักษร |
| Tweed Brown | #7C5A3A | Accent / รองเท้า / เข็มขัด / กระเป๋า |
| Deep Olive | #4A5136 | ชุดสุภาพ / สูท / เดรส |
| Camel Beige | #C7A27C | ชุดผู้หญิง / กางเกง / Accessories |
| Ash Grey | #B8B8B2 | สูท / เดรส / ชุดสุภาพ |
| Off-white | #F8F6F0 | พื้นหลัง / เสื้อเชิ้ต / ชุดโทนสว่าง |

ควรแยกไกด์เป็น:

### For Gentlemen

- Navy suit
- Grey suit
- Brown loafer
- White or cream shirt
- Minimal accessories

### For Ladies

- Midi dress
- Satin dress
- Elegant jumpsuit
- Soft tailoring
- Minimal jewelry

ไม่ควรทำให้รกเกินไป ควรใช้ภาพตัวอย่างหรือ Color Palette มากกว่าข้อความยาว

---

## 3.6 RSVP / ยืนยันการเข้าร่วมงาน

เป็นฟีเจอร์สำคัญหากต้องการเก็บจำนวนแขก

ข้อมูลที่ควรเก็บ:

1. ชื่อ-นามสกุล
2. เบอร์โทรศัพท์
3. จำนวนผู้ร่วมงาน
4. สถานะการเข้าร่วม
   - เข้าร่วม
   - ไม่สะดวกเข้าร่วม
   - ยังไม่แน่ใจ
5. ข้อความเพิ่มเติม
6. อาหารที่แพ้ / ข้อจำกัดด้านอาหาร ถ้ามี

ตัวเลือกการ Implement:

### Option A: ใช้ Google Form

เหมาะสำหรับเริ่มต้นเร็วที่สุด

ข้อดี:

- ทำง่าย
- ไม่ต้องเขียน Backend
- ข้อมูลเข้า Google Sheets ทันที
- แชร์ให้ทีมดูได้ง่าย

ข้อเสีย:

- หน้าตาอาจไม่เข้ากับเว็บไซต์ 100%

### Option B: ทำ Form ในเว็บไซต์ แล้วส่งเข้า Google Sheets

เหมาะถ้าต้องการให้ดู Premium และเข้ากับดีไซน์เว็บไซต์

ข้อดี:

- UX สวยกว่า
- ควบคุมหน้าตาได้
- แขกไม่รู้สึกว่าถูกส่งไปเว็บอื่น

ข้อเสีย:

- ต้อง Implement เพิ่ม

### Option C: ใช้ Database เช่น Firebase / Supabase

เหมาะสำหรับระบบที่ต้องการจริงจังมากขึ้น

ข้อดี:

- จัดการข้อมูลยืดหยุ่น
- ทำ Dashboard ได้
- รองรับระบบหลังบ้าน

ข้อเสีย:

- ใช้เวลาพัฒนามากกว่า

คำแนะนำ:  
เริ่มต้นด้วย **Google Form หรือ Google Sheets Integration** จะคุ้มที่สุดสำหรับงานแต่ง

---

## 3.7 Wishes / ส่งคำอวยพร

ให้แขกสามารถเขียนคำอวยพรผ่านเว็บไซต์ได้

ฟีเจอร์ที่ควรมี:

- ช่องกรอกชื่อ
- ช่องกรอกคำอวยพร
- ปุ่มส่งคำอวยพร
- แสดงข้อความอวยพรบางส่วนบนหน้าเว็บ
- มีระบบซ่อนข้อความก่อน approve หากต้องการความปลอดภัย

คำแนะนำ:

ถ้าอยากทำง่าย ใช้ Google Form แยกอีกฟอร์มหนึ่งได้  
ถ้าอยากให้ดูดี ให้ทำเป็น Form ในเว็บไซต์แล้วส่งเข้า Google Sheets หรือ Database

---

## 3.8 Gallery / รูปภาพในงาน

Gallery สามารถมีได้ทั้งก่อนงานและหลังงาน

ก่อนงาน:

- Pre-wedding photos
- Mood photos
- Venue photos

หลังงาน:

- รูปบรรยากาศงาน
- รูปแขก
- รูปพิธี
- ลิงก์ดาวน์โหลดรูปทั้งหมด

Option ที่แนะนำ:

1. ฝัง Google Drive Folder
2. เชื่อม Google Photos Album
3. ใช้ระบบ Upload รูปจากแขก
4. ทำ Gallery Grid บนเว็บไซต์

คำแนะนำ:

สำหรับเวอร์ชันแรก ให้ใส่ปุ่ม:

```text
View Wedding Gallery
Upload Your Photos
```

แล้วลิงก์ไป Google Drive / Google Photos จะง่ายและเสถียรกว่า

---

## 3.9 Contact / ติดต่อ

ควรมีช่องทางติดต่อสำหรับแขกที่มีคำถาม เช่น หลงทาง ต้องการถามเรื่องเวลา หรือสอบถามรายละเอียดอื่น ๆ

ควรมี:

- เบอร์โทรผู้ประสานงาน
- LINE Official Account
- ปุ่ม Add LINE
- ปุ่ม Call
- ปุ่ม Message

ตัวอย่าง:

```text
For any questions, please contact our wedding team.
LINE Official: @yourlineid
Phone: xxx-xxx-xxxx
```

---

## 3.10 FAQ / คำถามที่พบบ่อย

ช่วยลดการตอบคำถามซ้ำ

คำถามที่ควรมี:

1. งานเริ่มกี่โมง?
2. มีที่จอดรถไหม?
3. แต่งตัวสีอะไรได้บ้าง?
4. พาเพื่อนไปด้วยได้ไหม?
5. ต้อง RSVP ภายในวันไหน?
6. มี After Party ไหม?
7. ส่งรูปงานได้ที่ไหน?
8. เดินทางด้วย BTS/MRT/รถยนต์อย่างไร?

---

## 4. Responsive Design Requirement

เว็บไซต์ต้องแสดงผลดีทั้งมือถือ Tablet และ Desktop

Breakpoint ที่แนะนำ:

```text
Mobile: 320px – 767px
Tablet: 768px – 1023px
Desktop: 1024px ขึ้นไป
```

หลักการออกแบบ Responsive:

1. ใช้ Mobile-first Design
2. หลีกเลี่ยง Text ที่เล็กเกินไป
3. ปุ่มต้องกดง่ายบนมือถือ
4. ระยะห่างระหว่าง Section ต้องพอดี
5. รูปภาพต้องไม่โดน Crop จนเสียความหมาย
6. Card ควรเรียงแนวตั้งบนมือถือ
7. Navbar บนมือถือควรเปลี่ยนเป็น Hamburger Menu
8. หลีกเลี่ยงตารางที่กว้างเกินจอมือถือ
9. ใช้ max-width เพื่อไม่ให้เนื้อหากว้างเกินบน Desktop
10. ทดสอบบน iPhone, Android และ Desktop

---

## 5. Design Direction

## 5.1 Mood & Tone

คอนเซปต์:

```text
Modern Old Money Wedding
Minimal, refined, elegant, editorial, timeless
```

ความรู้สึกที่ควรได้:

- เรียบหรู
- ดูแพง
- ไม่ลิเก
- ไม่รก
- ไม่หวานเลี่ยนเกินไป
- ทันสมัยแต่ยังคลาสสิก

---

## 5.2 Color Palette

สีหลัก:

```text
Oxford Navy: #0A1F44
Off-white: #F8F6F0
Tweed Brown: #7C5A3A
Camel Beige: #C7A27C
Deep Olive: #4A5136
Ash Grey: #B8B8B2
```

การใช้งานสี:

- Background: Off-white
- Primary Text: Oxford Navy
- Accent: Tweed Brown / Camel Beige
- Secondary Accent: Deep Olive
- Border: Ash Grey หรือ Navy แบบโปร่งแสง

---

## 5.3 Typography

แนะนำใช้ Font Pairing แบบหรู อ่านง่าย

### English Font

- Playfair Display
- Cormorant Garamond
- Libre Baskerville
- Inter
- Montserrat

### Thai Font

- Noto Sans Thai
- IBM Plex Sans Thai
- Prompt
- Sarabun

คำแนะนำ:

- ชื่อคู่บ่าวสาวใช้ Serif Font เพื่อความหรู
- รายละเอียดทั่วไปใช้ Sans-serif เพื่อให้อ่านง่าย
- อย่าใช้ฟอนต์ Script เยอะเกินไป เพราะอาจอ่านยากบนมือถือ

---

## 6. Feature Priority

## Phase 1: Must-have

ควรทำก่อน เพราะจำเป็นต่อการใช้งานจริง

1. Hero Section
2. Event Info
3. Schedule
4. Location + Google Maps
5. Dress Code
6. RSVP
7. Contact
8. Mobile Responsive

---

## Phase 2: Nice-to-have

ทำเพิ่มหลังจากเว็บหลักเสร็จ

1. Wishes
2. Gallery
3. FAQ
4. Countdown Timer
5. Add to Calendar
6. LINE Official Button
7. Share Website Button

---

## Phase 3: Advanced

เหมาะถ้าต้องการให้เว็บสมบูรณ์มากขึ้น

1. Guest Management Dashboard
2. RSVP Export to CSV
3. Private Gallery
4. Password-protected Page
5. Admin Approval for Wishes
6. Upload Photos by Guests
7. Multilingual Thai / English Toggle

---

## 7. Recommended Tech Stack

## Option A: Simple & Fast

เหมาะกับงานแต่งที่ต้องการเว็บสวย ใช้งานจริง และไม่ซับซ้อน

```text
Frontend: Next.js / React
Styling: Tailwind CSS
Form: Google Form หรือ Google Sheets
Hosting: Vercel
Domain: Custom Domain
```

ข้อดี:

- ทำเร็ว
- Deploy ง่าย
- Responsive ง่าย
- รองรับ SEO
- เหมาะกับเว็บหน้าเดียว

---

## Option B: No-code / Low-code

เหมาะถ้าไม่อยากเขียนโค้ดเยอะ

```text
Platform: Framer / Webflow / Wix
Form: Built-in Form หรือ Google Form
Hosting: Built-in
```

ข้อดี:

- ทำเร็วมาก
- แก้ไขเองง่าย
- ไม่ต้องดูแลระบบมาก

ข้อเสีย:

- Custom บางอย่างอาจจำกัด
- ค่าใช้จ่ายรายเดือนอาจสูงกว่า

---

## Option C: Full Custom

เหมาะถ้าต้องการระบบแขกจริงจัง

```text
Frontend: Next.js
Backend: Supabase / Firebase
Database: Supabase PostgreSQL / Firestore
Storage: Google Drive / Cloudinary / Supabase Storage
Hosting: Vercel
```

ข้อดี:

- ยืดหยุ่นสูง
- ทำระบบหลังบ้านได้
- รองรับ RSVP / Wishes / Gallery แบบจริงจัง

ข้อเสีย:

- ใช้เวลาทำมากกว่า
- ต้องดูแลระบบมากกว่า

---

## 8. Sitemap

```text
/
├── Home
├── Schedule
├── Location
├── Dress Code
├── RSVP
├── Wishes
├── Gallery
├── FAQ
└── Contact
```

ถ้าทำหลายหน้า:

```text
/
/rsvp
/gallery
/dress-code
/location
```

แต่สำหรับงานแต่ง แนะนำให้เริ่มจาก One-page ก่อน

---

## 9. Navigation Menu

เมนูที่ควรมี:

```text
Home
Schedule
Location
Dress Code
RSVP
Gallery
Contact
```

บนมือถือ:

- ใช้ Hamburger Menu
- หรือใช้ Floating Bottom Menu ก็ได้

ตัวอย่าง Bottom Menu สำหรับมือถือ:

```text
Location | Schedule | Dress Code | RSVP
```

เหมาะมากสำหรับแขกที่เปิดเว็บจาก LINE

---

## 10. Data Structure เบื้องต้น

## 10.1 RSVP Data

```json
{
  "name": "",
  "phone": "",
  "attendance": "attending | not_attending | unsure",
  "guest_count": 1,
  "dietary_note": "",
  "message": "",
  "submitted_at": ""
}
```

## 10.2 Wishes Data

```json
{
  "name": "",
  "message": "",
  "is_approved": false,
  "submitted_at": ""
}
```

## 10.3 Gallery Data

```json
{
  "image_url": "",
  "caption": "",
  "uploaded_by": "",
  "uploaded_at": ""
}
```

---

## 11. UX Flow สำหรับแขก

## Flow 1: แขกเปิดจาก LINE Rich Menu

```text
LINE Rich Menu
↓
Wedding Website
↓
ดูข้อมูลหลัก
↓
ดู Location / Schedule / Dress Code
↓
กด RSVP
↓
ส่งข้อมูลสำเร็จ
```

## Flow 2: แขกต้องการดูสถานที่

```text
เปิดเว็บไซต์
↓
กด Location
↓
ดูแผนที่
↓
กด Open Google Maps
↓
นำทางไปสถานที่
```

## Flow 3: แขกต้องการดูธีมชุด

```text
เปิดเว็บไซต์
↓
กด Dress Code
↓
ดู Color Palette
↓
ดูตัวอย่างชุดชาย / หญิง
↓
เลือกชุดให้เข้าธีม
```

---

## 12. SEO และ Sharing

แม้จะเป็นเว็บไซต์งานแต่งส่วนตัว แต่ควรตั้งค่าให้แชร์แล้วดูดี

ควรมี:

- Title
- Meta Description
- Open Graph Image
- Favicon
- Preview Image สำหรับแชร์ใน LINE / Facebook

ตัวอย่าง:

```text
Title: Smart & Jajah Wedding
Description: Join us for the wedding celebration of Smart & Jajah on 1 November 2026 at Pearl Wedding Avenue.
```

Open Graph Image:

- ขนาดแนะนำ: 1200 x 630 px
- ใช้ดีไซน์เดียวกับการ์ดงานแต่ง
- ใส่ชื่อคู่บ่าวสาว วันที่ และสถานที่

---

## 13. Performance Requirement

เว็บไซต์ควรโหลดเร็ว โดยเฉพาะเมื่อแขกเปิดผ่านมือถือ

Checklist:

- รูปภาพต้องถูกบีบอัด
- ใช้ WebP หรือ AVIF หากทำได้
- หลีกเลี่ยง Animation หนักเกินไป
- Lazy load รูปภาพ Gallery
- ใช้ Font เท่าที่จำเป็น
- Google Maps อาจโหลดเมื่อเลื่อนถึง Section นั้น
- ขนาดหน้าแรกไม่ควรหนักเกินไป

---

## 14. Accessibility Requirement

เพื่อให้ทุกคนใช้งานได้ง่าย

ควรทำ:

- สีตัวอักษร contrast ชัดเจน
- ปุ่มมีขนาดใหญ่พอสำหรับนิ้วบนมือถือ
- ใช้ alt text กับรูปภาพ
- Form มี label ชัดเจน
- ไม่ใช้ตัวอักษรบางเกินไป
- อย่าใช้ animation ที่รบกวนการอ่าน

---

## 15. Content ที่ต้องเตรียมก่อนเริ่มทำเว็บ

ข้อมูลที่ต้องมี:

1. ชื่อเจ้าบ่าว / เจ้าสาว
2. วันที่จัดงาน
3. เวลาเริ่มงาน
4. สถานที่และที่อยู่เต็ม
5. Google Maps Link
6. กำหนดการจริง
7. Dress Code Guideline
8. เบอร์ติดต่อผู้ประสานงาน
9. LINE Official Link
10. รูป Pre-wedding หรือ Mood Image
11. RSVP Deadline
12. จำนวนแขกสูงสุดต่อคำเชิญ ถ้ามี
13. ข้อความต้อนรับแขก
14. Link Gallery หรือ Google Drive
15. Domain ที่ต้องการใช้

---

## 16. Suggested Page Copy

## Hero

```text
SMART & JAJAH
Together with their families
request the pleasure of your company
at the celebration of their wedding.

Sunday, 1 November 2026
Pearl Wedding Avenue
```

## Dress Code

```text
Old Money Elegance

We kindly invite our guests to dress in refined, timeless tones inspired by classic old money style.
Suggested colors include Oxford Navy, Tweed Brown, Deep Olive, Camel Beige, Ash Grey, and Off-white.
```

## RSVP

```text
Please confirm your attendance by [RSVP Deadline].
Your response will help us prepare the celebration beautifully for everyone.
```

## Contact

```text
For any questions about the wedding, location, or schedule, please contact our wedding team via LINE Official or phone.
```

---

## 17. Development Checklist

## Design

- [ ] กำหนด Moodboard
- [ ] กำหนด Color Palette
- [ ] เลือก Font
- [ ] ออกแบบ Desktop Layout
- [ ] ออกแบบ Mobile Layout
- [ ] เตรียมภาพประกอบ

## Frontend

- [ ] สร้าง Project
- [ ] Setup Tailwind CSS
- [ ] สร้าง Layout หลัก
- [ ] ทำ Navbar
- [ ] ทำ Hero Section
- [ ] ทำ Event Info Cards
- [ ] ทำ Schedule Section
- [ ] ทำ Location Section
- [ ] ทำ Dress Code Section
- [ ] ทำ RSVP Section
- [ ] ทำ Contact Section
- [ ] ทำ Footer

## Form

- [ ] เลือกวิธีเก็บข้อมูล RSVP
- [ ] สร้าง Google Form / Google Sheet
- [ ] เชื่อม Form กับเว็บไซต์
- [ ] ทดสอบส่งข้อมูล
- [ ] ทดสอบบนมือถือ

## Responsive

- [ ] ทดสอบ iPhone
- [ ] ทดสอบ Android
- [ ] ทดสอบ iPad
- [ ] ทดสอบ Desktop
- [ ] ทดสอบบน LINE Browser

## Deployment

- [ ] Deploy บน Vercel
- [ ] เชื่อม Custom Domain
- [ ] ตั้งค่า HTTPS
- [ ] ตั้งค่า Meta Tag
- [ ] ตั้งค่า Preview Image
- [ ] ทดสอบแชร์ลิงก์ใน LINE

---

## 18. Recommended MVP Version

ถ้าต้องทำเวอร์ชันแรกให้เสร็จเร็วและใช้งานได้จริง แนะนำให้ทำเฉพาะส่วนนี้ก่อน:

1. Hero
2. Date / Time / Venue
3. Schedule
4. Location + Google Maps
5. Dress Code
6. RSVP Button หรือ RSVP Form
7. Contact
8. Footer

ฟีเจอร์อื่น เช่น Wishes และ Gallery สามารถเพิ่มทีหลังได้

---

## 19. Final Recommendation

สำหรับเว็บไซต์งานแต่งของ Jajah & Smart แนะนำให้เริ่มจาก:

```text
One-page Responsive Website
+ Old Money Luxury Design
+ RSVP via Google Form or Google Sheets
+ Location / Schedule / Dress Code / Contact
+ เชื่อมกับ LINE Official Rich Menu
```

แนวทางนี้จะทำให้เว็บไซต์ดูสวย ใช้งานง่าย ทำได้เร็ว และเหมาะกับแขกที่เปิดผ่านมือถือจาก LINE มากที่สุด

