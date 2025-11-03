# Build APK with Android Studio

## Steps to Build

### 1. Open Android Studio
- Open Android Studio on your computer
- Click "Open" or "File → Open"

### 2. Select Project Folder
- Navigate to: `C:\Users\Lenovo\Desktop\react native+mern\mobile\android`
- Click "Open" (or Open As Project if prompted)
- Wait for Android Studio to sync and index

### 3. Let Gradle Sync Complete
- Android Studio will show "Gradle build running..." at the bottom
- Wait until it says "Gradle build successful"
- This may take 5-10 minutes on first build

### 4. Build the APK
**Option A: Using Menu**
1. Click: `Build` menu
2. Click: `Build Bundle(s) / APK(s)`
3. Click: `Build APK(s)`
4. Wait 5-10 minutes for build to complete

**Option B: Using Keyboard Shortcut**
- Press: `Ctrl + Shift + A`
- Type: "Build APK"
- Press Enter

### 5. Find Your APK
Once build is complete, you'll see a notification at the bottom saying "Build completed successfully"

The APK file is located at:
```
C:\Users\Lenovo\Desktop\react native+mern\mobile\android\app\build\outputs\apk\debug\app-debug.apk
```

OR for release APK:
```
C:\Users\Lenovo\Desktop\react native+mern\mobile\android\app\build\outputs\apk\release\app-release.apk
```

### 6. Install on Phone

**Option A: Using Android Studio**
1. Connect your Android phone via USB
2. Enable USB Debugging on phone (Settings → Developer Options → USB Debugging)
3. Go to: `Run` menu → `Run app` (or press Shift+F10)
4. Select your device
5. App will install and run automatically

**Option B: Manual Transfer**
1. Find the APK file (step 5)
2. Copy it to your phone via USB or email
3. Open File Manager on phone
4. Tap the APK file
5. Tap "Install"
6. Wait for installation to complete
7. Open the app and login with:
   - Email: john@example.com
   - Password: password123

## Troubleshooting

### Build fails with "Kotlin" error
- This is already fixed in the build.gradle (Kotlin 2.0.21 is set)
- Clean the build: `Build → Clean Project`
- Then rebuild

### "Android SDK not found"
- Go to: File → Settings → Appearance & Behavior → System Settings → Android SDK
- Make sure Android SDK is installed at: `C:\Users\Lenovo\AppData\Local\Android\Sdk`

### Phone not detected
1. Make sure USB Debugging is enabled on phone
2. Try different USB port
3. Install USB drivers for your phone brand

### Installation fails
- Go to phone Settings → Apps → Unknown Sources → Allow
- Then try installing APK again

## Quick Commands (if building from terminal)

If you prefer to build from PowerShell instead:

```powershell
cd "C:\Users\Lenovo\Desktop\react native+mern\mobile\android"
$env:ANDROID_HOME = "C:\Users\Lenovo\AppData\Local\Android\Sdk"
./gradlew.bat assembleDebug
```

APK will be at: `app\build\outputs\apk\debug\app-debug.apk`

For release APK:
```powershell
./gradlew.bat assembleRelease
```

(Note: Release APK requires a keystore which can be generated in Android Studio)

## Your App Details
- App Name: Event Manager Mobile
- Package: com.eventmanagement.mobile
- Backend: https://react-native-mern-project.onrender.com/api
- Demo Credentials:
  - john@example.com / password123
  - jane@example.com / password123
  - mike@example.com / password123
