# Tekron: macOS Desktop App Guide

This guide explains how to make the Tekron application available as a desktop-like experience for macOS users ("dform" / Dock Form). Since Tekron is built with Expo, we can leverage the **Propgressive Web App (PWA)** capabilities to install it as a native-feeling app on macOS.

## 📱 Developer Plan: Enabling Web Support

Before users can install the app on Mac, we must ensure the web version is ready.

### 1. Verification
Your `app.json` is already configured for web PWA support:
```json
"web": {
  "output": "static",
  "bundler": "metro",
  "pwa": {
    "enabled": true,
    "offline": { "enabled": true }
  }
}
```

### 2. Testing Locally
To verify the web version works before deployment:

1.  Open your terminal in `tekron-frontend`.
2.  Run the web server:
    ```bash
    npm run web
    ```
    *(This runs `expo start --web`)*.
3.  Open the provided URL (usually `http://localhost:8081`) in Safari or Chrome.

### 3. Deploying for Users
For users to access it, you must deploy the web export.
1.  **Build** the website:
    ```bash
    npx expo export -p web
    ```
    This creates a `dist` folder.
2.  **Deploy** this `dist` folder to Vercel, Netlify, or your own server.

---

## 🖥️ User Guide: Installing Tekron on macOS

Once the web version is deployed (e.g., `https://tekron.app`), macOS users can turn it into a desktop app using one of the following methods.

### Method 1: Safari "Add to Dock" (Recommended for macOS Sonoma+)
*Best for: Native Mac feel, separation from browser history.*

1.  Open **Safari**.
2.  Navigate to the Tekron web URL.
3.  In the menu bar, click **File** > **Add to Dock...**.
4.  You can name it "Tekron" and ensure the icon is correct.
5.  Click **Add**.
6.  **Result**: Tekron now appears in the Dock and Launchpad. It opens in its own window, separate from Safari, behaving like a native app.

### Method 2: Google Chrome / Edge PWA
*Best for: Users who prefer Chrome engine.*

1.  Open **Google Chrome**.
2.  Navigate to the Tekron web URL.
3.  Look for the **Install icon** (looks like a monitor with a down arrow) on the right side of the address bar.
    *   *Alternatively*: Click the **three dots** (Menu) > **Save and Share** > **Install Tekron**.
4.  Click **Install**.
5.  **Result**: Tekron installs as a Chrome App. It will be available in your `/Applications/Chrome Apps` folder and can be pinned to the Dock.

---

## 🛠️ Advanced: Native Wrapper (Optional)
If you require a downloadable `.dmg` file for distribution (outside of the browser methods), you can use a wrapper tool.

**Tools:**
*   **Electron**: wrappers like `nativefier`.
*   **Tauri**: lighter wrapper.

**Example using Nativefier:**
1.  Install nativefier: `npm install -g nativefier`
2.  Build the app:
    ```bash
    nativefier "https://tekron.app" --name "Tekron" --platform mac --arch arm64
    ```
    *(Note: This requires the URL to be live)*.
