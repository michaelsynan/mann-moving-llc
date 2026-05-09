### To-Do List

**1. Remove SMS Steps**

- **File:** `app/components/Moving/FormCard.vue`
  - ✅ Removed the `$fetch` call to `/api/sms` within `onSubmit`.
- **File:** `server/api/sms.post.ts`
  - ✅ Confirmed nothing else calls `/api/sms`.
  - ✅ Disabled the route to return `410 Gone` (SMS removed) and removed the Twilio implementation.
  - ✅ Removed Twilio runtime config from `nuxt.config.ts` and removed the `twilio` dependency.

**2. Implement/Fix Supabase Insertion for Moving and Removal Forms**

- **Important decision (pre-step):** decide whether inserts should happen **client-side** (via `useSupabaseClient()` in the browser) or **server-side** (via a Nitro API route).
  - Client-side inserts require a Supabase RLS policy that allows anon/authenticated inserts into `jobs`.
  - If you want Turnstile to truly gate inserts, server-side insertion is usually the right approach: verify Turnstile on the server, then insert using a server Supabase client/service role key.

- **For `app/components/Moving/FormCard.vue`:**
  - Review the existing Supabase insert (it already inserts into `jobs`).
  - Ensure the data being inserted (`job_type`, `address_from`, `address_to`, `scheduled_date`, `status`, `notes`) is correct and complete for moving requests.
    - Note: current code inserts `scheduled_date: null` — confirm that’s intentional (there is no move date field in the form today).
  - Verify that the `supabase` client is correctly initialized and available.
  - Add error handling and user feedback for Supabase insertion failures.
- **For `app/components/Removal/FormCard.vue`:**
  - Initialize the Supabase client using `const supabase = useSupabaseClient()` (similar to the moving form).
  - Replace the current placeholder `console.log` submit handler with real submission.
  - Within the `onSubmit` function, after successful Turnstile verification, construct the data payload for the `jobs` table. This should include:
    - `job_type: 'removal'`
    - `address_from`: Based on `state.serviceAddress` (formatted into a string, consistent with moving)
    - `address_to`: Likely `null` for removal
    - `scheduled_date`: Based on `state.serviceDate` (confirm expected DB type/format)
    - `status: 'new'`
    - `notes`: Combine `state.notes` and `state.photoDescriptions` into a comprehensive note.
  - Execute the Supabase insertion: `await supabase.from('jobs').insert(...)`.
  - Add error handling and user feedback for Supabase insertion failures.
  - Consider how to handle photo uploads. Supabase Storage might be an option if photos need to be stored. For now, perhaps just include photo descriptions in the notes.
