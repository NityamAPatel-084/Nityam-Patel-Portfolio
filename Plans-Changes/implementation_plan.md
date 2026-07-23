# Mobile Responsiveness, Layout Grid, and Thumbnail Repair Plan

This plan addresses layout issues on mobile devices, formatting of cards in index sections to span the full width, and fixing base64 image/PDF corruption from sanitization.

## Proposed Changes

---

### 1. Collapsible/Expandable Sidebar Navigation (Mobile Support)

#### [MODIFY] [Sidebar.tsx](file:///e:/Portfolio/Nityam-Patel-Portfolio/src/components/Sidebar.tsx)
- Add responsive layout classes to hide the sidebar on mobile screens (`hidden md:flex`) and styling classes to support drawing it as a slide-out overlay on mobile when open.
- Add a close button (`X` icon) on mobile to easily collapse the menu.

#### [MODIFY] [App.tsx](file:///e:/Portfolio/Nityam-Patel-Portfolio/src/App.tsx)
- Implement `isMobileMenuOpen` state toggling.
- Render a floating hamburger button in the top navigation bar header (`Menu` icon) that is only visible on mobile/tablet viewports (`block md:hidden`).
- Change the `main` container padding-left dynamically from `pl-52` to `pl-0 md:pl-52` to reclaim full screen width on mobile devices.

---

### 2. Single Column Card Grids

#### [MODIFY] [ProjectSlider.tsx](file:///e:/Portfolio/Nityam-Patel-Portfolio/src/components/ProjectSlider.tsx)
- Change the grid class from `grid-cols-1 xl:grid-cols-2` to `grid-cols-1` to expand all project cards to full layout width.

#### [MODIFY] [HackathonsCard.tsx](file:///e:/Portfolio/Nityam-Patel-Portfolio/src/components/HackathonsCard.tsx)
- Change the grid class from `grid-cols-1 xl:grid-cols-2` to `grid-cols-1` to expand hackathon cards to full layout width.

#### [MODIFY] [CertificatesList.tsx](file:///e:/Portfolio/Nityam-Patel-Portfolio/src/components/CertificatesList.tsx)
- Change the grid class from `grid-cols-1 xl:grid-cols-2` to `grid-cols-1` to expand certification cards to full layout width.
- Remove `referrerPolicy="no-referrer"` from `<img>` tag to allow external hosts to authenticate referrer headers for preview images.

---

### 3. Repairing Thumbnail Images & Base64/PDF uploads

#### [MODIFY] [AdminDashboard.tsx](file:///e:/Portfolio/Nityam-Patel-Portfolio/src/components/AdminDashboard.tsx)
- Stop passing Base64 image and PDF data strings through `sanitizePlainString` inside the save handlers:
  - In `saveCert`, set `credentialUrl: certForm.credentialUrl || ''`.
  - In `saveProject`, set `videoUrl: projectForm.videoUrl || ''`.
- Keep other text inputs sanitized to prevent XSS while preserving 100% of binary image/document characters.

## Verification Plan

### Automated Tests
- Run `npm run build` to verify there are no TypeScript compilation errors.

### Manual Verification
- Test viewport scaling to verify the mobile menu toggles properly and shifts the main layout.
- Verify that cards in Projects, Certifications, and Hackathons span the full width of the screen in single-column layouts.
- Upload a new image as a certificate/project thumbnail and verify it displays correctly without breaking.
