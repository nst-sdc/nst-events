# Codebase Issues

This document lists the technical debt, TODOs, and potential issues found within the codebase.

## Tekron Frontend



## Tekron Backend

### `src/controllers/lostFoundController.js`
- **Line 90**: `TODO: Admin check logic if needed`
  - *Context*: The controller might need additional verification to ensure only admins can perform certain actions, or verifying the admin status more robustly.

## General / Documentation

### `Document/plan.md`
- The project plan tracks high-level tasks. Key pending items include:
  - Phase 9: Testing (QR scanning, network conditions, crash handling)
  - Phase 10: Build & Deployment (Release build, deployment to Render/Firebase)
  - Phase 11: Final Touches (Data loading, volunteer accounts)
