# Deployment Guide

This project is ready to deploy as a Next.js app.

## Current production checks

- `npm run lint`
- `npm run build`

Both commands should pass before publishing updates.

## Recommended hosting

Use Vercel for the production website because it supports Next.js routes, including the RSVP API route at `/api/rsvp`, without extra server setup.

## Deploy with GitHub + Vercel

1. Create a new GitHub repository.
2. Push this local project to the repository.
3. In Vercel, choose **Add New Project**.
4. Import the GitHub repository.
5. Keep the default framework settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Install Command: `npm install`
6. Deploy.

## RSVP

The RSVP form submits to Google Forms through `app/api/rsvp/route.ts`.

No production environment variables are required for the current RSVP flow.

## Custom domain

After the Vercel deployment works:

1. Open the Vercel project.
2. Go to **Settings > Domains**.
3. Add the wedding domain.
4. Update the domain DNS records using the values Vercel shows.

Vercel will issue HTTPS automatically after DNS is connected.
