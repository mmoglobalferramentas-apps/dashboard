# Funnel Overview Implementation

Date: 2026-06-02
Project: `dashboard`

## Completed

- Implemented `/dashboard` as `app/dashboard/page.tsx`.
- Reused only cataloged primitives and assets:
  - `Button`
  - `Card`
  - `Badge`
  - `Alert`
  - `Select`
  - `Popover`
  - `Calendar`
  - `Progress`
  - `Tooltip`
  - `Label`
  - lucide icons
  - `/images/logos/iconBlack.svg`
  - `/images/dashboard/mountains-funnel-flux.png`
- Built the Funnel Overview shell with:
  - responsive dashboard sidebar/header
  - funnel/country/date filters
  - KPI rail
  - funnel passage rows
  - health alert
  - visual context card
  - expected backend data contract badges

## Data Handling

- No fake metric values were added.
- The page intentionally shows pending/empty states because `dashboard/` has no frontend API endpoint or `.env` for real Supabase reads yet.
- Expected backend sources are documented in the UI:
  - `vw_dashboard_filter_options`
  - `vw_dashboard_funnel_kpis`
  - `vw_dashboard_funnel_steps`
  - `dashboard_health_metrics`

## Additional Fix

- Fixed a build-blocking type issue in `app/login/page.tsx` by removing the invalid `as` prop usage from `FadeUp` while preserving the header markup inside the animation wrapper.

## Verification

- `npm run build` passed.
- Build output includes `/dashboard` as a static app route.
- Local dev server is running at `http://localhost:3000`.
- `curl -I http://localhost:3000/dashboard` returned HTTP 200.
- After layout adjustment, `npm run build` passed again.
- Captured and reviewed Playwright screenshots:
  - `/tmp/xboard-dashboard-desktop.png`
  - `/tmp/xboard-dashboard-mobile.png`

## Layout Adjustment

- Reworked `/dashboard` to better match Page 02 Funnel Overview from the catalog/wireframe:
  - compact title and filter row at the top
  - KPI rail directly below filters
  - dominant funnel flow panel
  - right-side visual card and funnel summary panel
- Removed developer-facing copy such as backend/view/endpoint references.
- Kept the no-mock-data rule by preserving empty product states instead of fabricated metric values.
- Rechecked design-system alignment against existing primitives and token usage.

## Sidebar And Responsive Navigation

- Moved the KPI cards and funnel progress panel into the left content column.
- Kept the visual and funnel summary cards in the right column with natural height.
- Changed the desktop sidebar logo to `/images/logos/iconWhite.svg`.
- Made the desktop sidebar sticky with `top-0` and `h-screen`.
- Changed the tablet/mobile header to the complete `/images/logos/logoWhite.svg` wordmark.
- Imported the shadcn `Sheet` component and added a hamburger-triggered mobile navigation drawer.
- Added `@radix-ui/react-dialog` through the shadcn CLI dependency flow.

## Responsive Verification

- Verified `/dashboard` on the clean local server at `http://localhost:3002`.
- `curl -I http://localhost:3002/dashboard` returned HTTP 200.
- Opened the mobile hamburger menu with Playwright and reviewed:
  - `/tmp/xboard-dashboard-mobile-menu.png`

## Two-Column Dashboard Grid

- Redesigned the main dashboard content as a clean two-column grid.
- Desktop layout:
  - left top: four metric cards in a 2x2 grid
  - right top: Funnel Progress / Fluxo do funil
  - left bottom: Funnel Flux
  - right bottom: Resumo do funil
- Mobile layout preserves the requested order:
  - filters
  - metric cards
  - progress card
  - Funnel Flux
  - Resumo do funil
- Applied 24px card gaps and 32px separation between the header and main dashboard grid.
- Used equal-height grid rows and `h-full` cards where appropriate.
- Verified the final layout at `http://localhost:3003/dashboard`.
- `curl -I http://localhost:3003/dashboard` returned HTTP 200.
- Reviewed Playwright screenshots:
  - `/tmp/xboard-dashboard-two-column-desktop.png`
  - `/tmp/xboard-dashboard-two-column-mobile.png`

## Fade-Up Motion

- Reused the existing `FadeUp` design-system component on the Funnel Overview
  content.
- Configured each animated block with a negative `y` offset and initial zero
  opacity.
- Preserved the existing once-only viewport behavior so animations do not
  replay after a component has entered the screen.
- Staggered the title, filters, metric cards, and funnel progress card so
  first-render content appears in a clear sequence.
- Kept the dashboard grid areas and equal-height card behavior on the animation
  wrappers.
- `npm run build` passed after the motion update.
- Playwright confirmed the animated title remains at `opacity: 1` and
  `transform: none` after leaving and returning to the viewport.
- Reviewed `/tmp/xboard-dashboard-fade-up.png` after the animation completed.

## Notes

- `components/ui/sheet.tsx` was added through the shadcn CLI for responsive navigation.
- No backend or database files were changed.
- The `dashboard` folder is not a Git repository, so no commit could be created.
