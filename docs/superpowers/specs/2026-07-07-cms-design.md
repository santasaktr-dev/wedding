# Wedding CMS Design

## Overview

Build a private CMS for the Jah & Smart wedding website so the site owner can edit website content section by section and manage gallery albums without editing source code. The CMS will live inside the existing Next.js app at `/admin` and will use Supabase for authentication, database records, and image storage.

The first CMS release focuses on two capabilities:

1. Editing main website content: hero, event info, schedule, location, dress code text, FAQ, contact, and gallery copy.
2. Managing gallery albums: create/edit albums, upload multiple images, set cover images, edit captions and alt text, delete images, and reorder images with drag and drop.

RSVP form configuration and RSVP response management are out of scope for the first CMS release. The existing RSVP behavior should continue to work.

## Goals

- Provide an authenticated admin area at `/admin`.
- Let admins edit English and Thai content using language tabs.
- Let admins save draft changes without affecting the public website.
- Let admins preview draft content inline and as a full-page draft preview.
- Let admins publish draft changes intentionally.
- Let admins manage albums and images with a workflow that is easier than editing source files.
- Preserve the existing public wedding website appearance unless content changes are published.

## Non-Goals

- No public guest accounts.
- No RSVP response dashboard in the first release.
- No full visual page builder or arbitrary layout editing.
- No image editing tools such as crop, filters, or retouching in the first release.
- No multi-admin role hierarchy beyond authenticated admin access.

## Chosen Approach

Use a custom Next.js CMS backed by Supabase.

Supabase will provide:

- Auth: email/password login for admins.
- Postgres: content sections, content versions, albums, and image metadata.
- Storage: uploaded gallery images in a `wedding-gallery` bucket.

This approach is preferred over a generic headless CMS because the required UX is specific: bilingual content tabs, section-by-section editing, album cover selection, multi-image upload, drag-and-drop ordering, draft preview, and publish control.

## Admin Information Architecture

The `/admin` area uses a hybrid CMS layout with three top-level tabs.

### Content

The Content tab lists editable website sections. Selecting a section opens a section-specific editor and an inline preview panel.

Editable sections:

- Hero
- Event Info
- Schedule
- Location
- Dress Code copy and palette labels
- Gallery intro and CTA copy
- FAQ
- Contact
- Footer copy

Each editor supports language tabs:

- English
- Thai

Only fields relevant to the selected section are shown. Repeating data such as schedule items and FAQ entries should use add/remove/reorder controls rather than raw JSON text.

### Gallery

The Gallery tab is optimized for album and image management.

Core workflow:

1. Select an album from the album list.
2. Edit album title, description, label, sort order, and language-specific fields.
3. Upload multiple images into the selected album.
4. Edit each image caption and alt text for English and Thai.
5. Set one image as the album cover.
6. Reorder images by drag and drop.
7. Delete images when needed.
8. Save changes as draft.

Gallery UI should show the current cover image, photo count, upload progress, and clear error messages for failed uploads.

### Settings

The Settings tab contains operational settings that are safe for a first CMS release.

Settings can include:

- Site title and metadata copy.
- Default language.
- Publish status and last published timestamp.
- Supabase connection hints and setup checklist.

Settings should not include RSVP business logic in the first release.

## Draft, Preview, and Publish Workflow

The CMS uses a draft-first workflow.

- `Save draft` stores changes in draft records only.
- `Preview section` updates the inline admin preview.
- `Preview full page` opens the public website using draft content in a preview mode.
- `Publish` promotes the current draft content and gallery metadata to the published state used by the public website.

Public pages must read only published content by default. Draft content must not appear publicly unless preview mode is explicitly enabled for an authenticated admin.

If publish fails, the CMS should keep the draft unchanged and show a recoverable error message. No partial publish should leave public content in an inconsistent state.

## Data Model

The exact SQL can be finalized during implementation, but the CMS should use the following logical model.

### `content_versions`

Stores version-level metadata.

Fields:

- `id`
- `status`: `draft` or `published`
- `created_at`
- `updated_at`
- `published_at`
- `published_by`

### `content_sections`

Stores section content by version and language.

Fields:

- `id`
- `version_id`
- `section_key`
- `language`: `en` or `th`
- `content`: JSON object containing the section fields
- `updated_at`

Examples of `section_key`:

- `hero`
- `event_info`
- `schedule`
- `location`
- `dress_code`
- `gallery`
- `faq`
- `contact`
- `footer`

### `gallery_albums`

Stores album metadata.

Fields:

- `id`
- `slug`
- `status`: `draft` or `published`
- `sort_order`
- `cover_image_id`
- `title_en`
- `title_th`
- `description_en`
- `description_th`
- `label_en`
- `label_th`
- `created_at`
- `updated_at`

### `gallery_images`

Stores image metadata.

Fields:

- `id`
- `album_id`
- `storage_path`
- `public_url`
- `sort_order`
- `caption_en`
- `caption_th`
- `alt_en`
- `alt_th`
- `is_cover`
- `status`: `draft` or `published`
- `created_at`
- `updated_at`

### Supabase Storage

Bucket:

- `wedding-gallery`

Recommended storage path format:

```text
wedding-gallery/{album-slug}/{timestamp}-{safe-file-name}
```

The implementation should generate safe file names and avoid trusting raw client file names.

## Security

Admin access must use Supabase Auth email/password.

Rules:

- Unauthenticated users visiting `/admin` are redirected to login.
- Authenticated admins can read draft and published CMS records.
- Authenticated admins can create, update, and delete draft records.
- Authenticated admins can upload and delete images from the gallery bucket.
- Public pages can read only published content and published gallery records.
- Draft preview access is available only to authenticated admins.

Supabase Row Level Security policies must enforce these rules on database tables and storage objects.

For the first release, any authenticated Supabase user for this project is treated as an admin. If stricter control is needed later, add an `admin_users` table or custom claims.

## Public Site Integration

The public website should be refactored to load content from a small data access layer rather than directly from hardcoded arrays inside page components.

Recommended modules:

- `lib/cms/types.ts`: shared content and gallery types.
- `lib/cms/server.ts`: server-side functions for loading published content and preview content.
- `lib/cms/fallback.ts`: fallback data copied from the current hardcoded content.

Fallback behavior:

- If Supabase environment variables are missing, the public site uses fallback content.
- If published content is missing during early setup, the public site uses fallback content.
- Once CMS content is seeded and published, Supabase content becomes the source of truth.

This keeps local development usable before Supabase setup is complete.

## Initial Data Migration

The first implementation should include a seed path that copies the current hardcoded website content into CMS-compatible data.

Seeded data should include:

- English and Thai content currently used by the homepage.
- Existing gallery album metadata.
- Existing image references from `public/images`.

The seed does not need to upload local images into Supabase automatically in the first release. Existing public image paths can be represented as initial image metadata, and future uploads will use Supabase Storage.

## Error Handling

The admin UI should provide clear, local error messages.

Expected error states:

- Login failed.
- Session expired.
- Draft save failed.
- Publish failed.
- Image upload failed.
- Image delete failed.
- Unsupported file type.
- File too large.
- Reorder save failed.

Upload errors should identify which file failed. Successful files should remain uploaded even if one file in a batch fails.

## Accessibility and UX Requirements

- Admin controls must be keyboard reachable.
- Buttons and upload controls must have visible labels.
- Drag-and-drop reorder must also provide non-drag controls or accessible fallback controls.
- Form fields must use visible labels.
- Image alt text fields should be visible and editable.
- Loading and saving states must be visible.
- Destructive actions such as deleting an album or image must require confirmation.
- The CMS should work on desktop and remain usable on tablet/mobile, but desktop is the primary admin target.

## Testing and Verification

Implementation should verify:

- Unauthenticated users cannot access `/admin`.
- Login with Supabase email/password reaches the admin dashboard.
- Saving draft content does not change public published content.
- Publishing draft content updates the public page.
- Draft preview shows draft content only for authenticated admins.
- Image upload creates storage objects and metadata records.
- Image reorder persists and public gallery respects the published order.
- Cover image selection persists.
- Delete image removes or hides the image consistently from draft and published views according to the final implementation choice.
- Public site builds successfully with and without Supabase environment variables.

## Implementation Phasing

### Phase 1: CMS Foundation

- Add Supabase client setup.
- Add environment variable documentation.
- Add auth login flow.
- Add `/admin` protected layout.
- Add fallback content module.

### Phase 2: Content Editing

- Add Content tab.
- Add section editors for current homepage sections.
- Add language tabs.
- Add draft save.
- Add inline preview.

### Phase 3: Gallery Management

- Add album list and album editor.
- Add multi-image upload to Supabase Storage.
- Add image metadata editing.
- Add cover image selection.
- Add drag-and-drop reorder with accessible fallback.

### Phase 4: Preview and Publish

- Add full-page draft preview.
- Add publish action.
- Refactor public pages to read published CMS content with fallback.
- Add setup seed path.

## Open Decisions Resolved

- CMS provider: Supabase.
- Auth method: Supabase Auth email/password.
- Editing scope: gallery plus main website content.
- Gallery MVP: upload multiple images, cover image, captions, alt text, delete, and drag-and-drop reorder.
- Bilingual editing: English/Thai tabs.
- Publish workflow: save draft plus explicit publish.
- Preview workflow: inline section preview and full-page draft preview.
