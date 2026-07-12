# Wedding Countdown Design

## Goal

เพิ่ม countdown ถึงเวลา 00:00 น. ของวันที่ 1 พฤศจิกายน 2026 ตามเวลา Asia/Bangkok เพื่อสร้างจุดเด่นหลัง Hero โดยไม่รบกวนภาพและปุ่มหลักของ Hero

## Experience

- วาง countdown เป็นบล็อกถัดจาก Hero และก่อน Event Info
- ใช้พื้น Oxford Navy, ตัวเลขสี Camel Beige และข้อความสีครีมตาม visual direction เดิม
- แสดง 4 ค่า: วัน, ชั่วโมง, นาที, วินาที
- บนมือถือจัดเป็น 2x2; บน desktop จัดเรียง 4 ช่องแนวนอน
- รองรับข้อความภาษาอังกฤษและภาษาไทยตาม language switcher ปัจจุบัน
- เมื่อถึงเวลาเป้าหมาย แทนที่ตัวเลขด้วยข้อความว่า “วันนี้คือวันของเรา” หรือ “Today is the day!”

## Implementation

- สร้าง client component แยกสำหรับ timer เพื่อจัดการ state และ interval
- ใช้ target timestamp ที่ระบุ timezone ชัดเจน ไม่พึ่ง timezone ของ browser
- อัปเดตทุก 1 วินาที และ cleanup interval เมื่อ component unmount
- ป้องกันค่าติดลบด้วยการ clamp เป็นศูนย์
- ฝัง component ในหน้าแรกระหว่าง Hero กับ Event Info

## Validation

- ตรวจ TypeScript/lint และหน้าเว็บตอบกลับได้
- ตรวจ layout ที่ viewport มือถือและ desktop
- ตรวจว่า countdown ไม่ทำให้ hydration mismatch และเมื่อถึงเป้าหมายเปลี่ยนข้อความได้ถูกต้อง
