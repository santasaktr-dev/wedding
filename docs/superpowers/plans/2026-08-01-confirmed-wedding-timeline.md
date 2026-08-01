# Confirmed Wedding Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the provisional schedule with the confirmed bilingual wedding-day timeline.

**Architecture:** The site reads its default content from `fallbackCmsSnapshot`. Updating the schedule data there changes both language versions while leaving the Schedule component and CMS editor contract intact. A focused CMS snapshot test prevents the confirmed times and fifth closing event from regressing.

**Tech Stack:** TypeScript, Next.js, Vitest.

---

### Task 1: Lock the confirmed timeline with a test

**Files:**
- Modify: `lib/cms/__tests__/server.test.ts`
- Test: `lib/cms/__tests__/server.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
it("provides the confirmed five-part bilingual wedding timeline by default", () => {
  const items = fallbackCmsSnapshot.content.schedule.items;

  expect(items.map((item) => item.time)).toEqual(["15.00 น.", "15.09 – 17.00 น.", "18.00 น.", "19.00 น.", "22.00 น."]);
  expect(items.at(-1)).toMatchObject({
    title: { en: "End of Celebration", th: "จบงาน" },
    detail: {
      en: "Event concludes — thank you for celebrating with us.",
      th: "งานเลี้ยงฉลองสิ้นสุดลง ขอบคุณที่มาร่วมเป็นส่วนหนึ่งของวันสำคัญนี้",
    },
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/cms/__tests__/server.test.ts`

Expected: FAIL because the default schedule still has four provisional `TBC` entries.

- [ ] **Step 3: Commit**

```bash
git add lib/cms/__tests__/server.test.ts
git commit -m "test: cover confirmed wedding timeline"
```

### Task 2: Add the confirmed English and Thai schedule

**Files:**
- Modify: `lib/cms/fallback.ts:134-177`
- Test: `lib/cms/__tests__/server.test.ts`

- [ ] **Step 1: Replace the schedule content**

```ts
intro: {
  en: "A celebration shared from the first welcome through the final toast.",
  th: "กำหนดการตลอดวัน ตั้งแต่ต้อนรับแขกจนถึงช่วงเฉลิมฉลอง",
},
items: [
  { id: "registration", time: "15.00 น.", title: { en: "Guest Registration", th: "ลงทะเบียนรับแขก" }, detail: { en: "Guests arrive and enjoy refreshments before the ceremony begins.", th: "แขกรับประทานอาหารว่างที่ห้องรับรอง ก่อนเริ่มพิธี" }, sortOrder: 0 },
  { id: "ceremony", time: "15.09 – 17.00 น.", title: { en: "Wedding Ceremony", th: "พิธีมงคลสมรส" }, detail: { en: "Ring exchange, blessing ceremony (Yok Nam Cha), and the Song Tua rite.", th: "พิธีสวมแหวน พิธีรับไหว้/ยกน้ำชา และพิธีส่งตัว" }, sortOrder: 1 },
  { id: "reception", time: "18.00 น.", title: { en: "Dinner Reception", th: "งานเลี้ยงฉลอง" }, detail: { en: "Guests enter the reception hall for drinks and dinner.", th: "แขกเข้าสู่ห้องจัดเลี้ยง เริ่มบริการเครื่องดื่มและอาหารค่ำ" }, sortOrder: 2 },
  { id: "toast", time: "19.00 น.", title: { en: "Toast & Celebration", th: "พิธีการบนเวที" }, detail: { en: "Speeches, candle & cake ceremony, and the bouquet toss.", th: "พิธีกรขึ้นเวที กล่าวอวยพร พิธีจุดเทียนมงคล ตัดเค้ก และโยนดอกไม้" }, sortOrder: 3 },
  { id: "end", time: "22.00 น.", title: { en: "End of Celebration", th: "จบงาน" }, detail: { en: "Event concludes — thank you for celebrating with us.", th: "งานเลี้ยงฉลองสิ้นสุดลง ขอบคุณที่มาร่วมเป็นส่วนหนึ่งของวันสำคัญนี้" }, sortOrder: 4 },
],
```

- [ ] **Step 2: Run the focused test to verify it passes**

Run: `npm test -- lib/cms/__tests__/server.test.ts`

Expected: PASS.

- [ ] **Step 3: Run project verification**

Run: `npm test && npm run build`

Expected: all tests pass and the production build completes.

- [ ] **Step 4: Commit**

```bash
git add lib/cms/fallback.ts lib/cms/__tests__/server.test.ts
git commit -m "feat: add confirmed bilingual wedding timeline"
```
