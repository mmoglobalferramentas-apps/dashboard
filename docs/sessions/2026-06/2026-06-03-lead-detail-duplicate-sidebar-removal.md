# Lead Detail Duplicate Sidebar Removal

Date: 2026-06-03  
Project: `dashboard`  
Route: `/dashboard/leads/[leadId]`

## Summary

Removed the sidebar rendered directly inside the Lead Detail page.

The route is already wrapped by `app/dashboard/layout.tsx`, which provides the shared `DashboardLayout` sidebar for all `/dashboard/*` pages. The page-level sidebar caused two sidebars to appear on desktop.

## File Modified

- `app/dashboard/leads/[leadId]/page.tsx`

## Changes

- Removed the internal desktop `<aside>`.
- Removed the internal `navItems` configuration.
- Removed icon imports used only by the duplicate sidebar.
- Preserved the shared dashboard sidebar, Lead Detail content, mobile header, fade-up animations, tooltips, clipboard action, and timeline.

## Validation

- `npm run build`: passed.
- Next.js linting and type checking: passed.
- Desktop visual check: passed.
- Confirmed `/dashboard/leads/ld_00284` renders with one sidebar.

## Note

`dashboard/` is not inside a Git repository, so no commit could be created.
