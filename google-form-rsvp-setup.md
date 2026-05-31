# Google Form RSVP Setup

The RSVP form on the website submits directly to this Google Form:

`https://forms.gle/ECyvWYyYS2x8pGVP7`

The API route maps the website fields to Google Form entry IDs in:

`app/api/rsvp/route.ts`

## Website Field Mapping

| Website Field | Google Form Question |
| --- | --- |
| Full Name | 1. ชื่อ-นามสกุล (Full Name) |
| Nickname | 2. ชื่อเล่น (Nickname) |
| Phone | 3. เบอร์โทรศัพท์ที่สามารถติดต่อได้ (Phone Number) |
| Relationship | 4. ความสัมพันธ์กับคู่บ่าวสาว (Relationship) |
| Attendance | 5. การยืนยันเข้าร่วมงาน (Attendance) |
| Guest Count | 6. จำนวนผู้ติดตาม (Guest Count) |
| Email | 7. Email |
| Message | 8. ข้อความอวยพร/ข้อความถึงคู่บ่าวสาว (Message) |

The website displays relationship, attendance, guest count, and dietary options in English while submitting the exact Thai option values required by the Google Form.

## Notes

- No `.env.local` is needed for RSVP.
- No Google Apps Script deployment is needed.
- If the Google Form questions or options change, update the entry IDs and submitted option values in `app/api/rsvp/route.ts` and `app/components/RsvpForm.tsx`.

## Add to Calendar

After successful RSVP submission, the website shows:

- `Add to Google Calendar`
- `Download .ics` for Apple Calendar, Outlook, and other calendar apps

No email provider or domain is required for this flow.
