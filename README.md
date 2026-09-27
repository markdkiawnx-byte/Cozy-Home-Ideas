# Cozy Home Ideas — Vercel + GitHub + Supabase

This version makes the admin panel **online**. Posts and groups are stored in Supabase, so visitors in the USA or anywhere else see the same content you publish.

## What is included
- Professional Cozy Home Ideas frontend
- Your `logo.png`
- Search, filters, favorites, trending and groups
- Secure server-side admin login
- Create/edit/delete posts
- Upload an image from your phone (image is stored in Supabase Storage)
- Add an image by URL
- Add/edit/delete groups/categories
- Vercel-ready API routes
- GitHub-ready project

## 1. Create Supabase project
1. Open https://supabase.com and create a free project.
2. In **SQL Editor**, paste all of `supabase.sql` and run it.
3. In **Storage**, create a bucket named `cozy-images` and set it to **Public**.
4. Go to Project Settings → API and copy the **Project URL** and **service_role** key.

## 2. Put project on GitHub
Upload the entire project folder to a new GitHub repository.
Do NOT upload `.env` or your Supabase service-role key.

## 3. Deploy on Vercel
Import the GitHub repository into Vercel.
Add these Environment Variables in Vercel:

- `SUPABASE_URL` = your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` = your Supabase **service_role** key
- `SUPABASE_BUCKET` = `cozy-images`
- `ADMIN_PASSWORD` = `ctz58235`
- `SESSION_SECRET` = a long random secret, for example 40+ random characters

Then Deploy.

## 4. Open the admin panel
On the live site press **Ctrl + Shift + A** on desktop.
On a phone, the small invisible owner trigger is at the bottom-right; you can also add a visible Admin button later if desired.
Password: `ctz58235`

## Important security note
The password is checked on the Vercel server, not in the public HTML. Keep the Supabase `service_role` key only in Vercel Environment Variables. Never paste that key into `index.html` or GitHub.

## Image upload
The admin panel compresses/resizes images in the browser before sending them to the server. The server stores them in the Supabase `cozy-images` bucket and returns a public image URL.
