# Catalog Date Range Picker Refactor

Date: 2026-06-03
Project: `dashboard`

## Scope

Refactored the date selector displayed in `/catalog` after identifying the local
`Calendar` wrapper as the source of the broken visual layout.

## Components Identified

- Date selector composition: `DateSelectorPreview` in `app/catalog/page.tsx`
- Shared calendar primitive: `components/ui/calendar.tsx`
- Supporting primitives: `components/ui/popover.tsx` and `components/ui/button.tsx`

## Changes

- Updated the shared `Calendar` wrapper using the current shadcn calendar
  structure for `react-day-picker`.
- Added the missing calendar grid, navigation, weekday, day, range, and state
  class names.
- Set calendar navigation arrows to use `text-card-foreground` for stronger
  contrast.
- Changed the catalog date selector to a controlled range selection with:
  - explicit start and end summary cards
  - two visible months on desktop
  - stacked months on mobile
  - Portuguese locale
  - premium card, border, contrast, and shadow styling

## Verification

- `npm run build` passed.
- `npx tsc --noEmit` passed.
- Desktop screenshot reviewed at `/tmp/dashboard-catalog-date-range.png`.
- Mobile screenshot reviewed at `/tmp/dashboard-catalog-date-range-mobile.png`.
- Confirmed the calendar no longer renders compressed weekday or day rows.
- Confirmed `dashboard/` is not inside a Git repository, so no commit could be
  created.
