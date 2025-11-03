# APK Build & Installation Guide

## Current Status
- ✅ Android SDK configured
- ✅ Java JDK installed (version 23.0.2)
- ✅ Gradle build started
- ⏳ Building APK (5-15 minutes)

## What's Happening
Gradle is currently:
1. Downloading required dependencies
2. Compiling your React Native code
3. Bundling JavaScript and assets
4. Creating the release APK

## Once Build is Complete

### Location of APK
```
C:\Users\Lenovo\Desktop\react native+mern\mobile\android\app\build\outputs\apk\release\app-release.apk
```

### Installation Steps

#### Option A: Using Android Studio
1. Connect Android phone via USB
2. Open Android Studio
3. Go to: Build → Generate Signed Bundle / APK → Select APK
4. Choose your keystore
5. Build

#### Option B: Using ADB (Faster)
1. Enable USB Debugging on phone (Settings → Developer Options)
2. Connect phone via USB
3. Run in PowerShell:
```powershell
$env:ANDROID_HOME = "C:\Users\Lenovo\AppData\Local\Android\Sdk"
$env:PATH = "$env:ANDROID_HOME\platform-tools;$env:PATH"
adb install "C:\Users\Lenovo\Desktop\react native+mern\mobile\android\app\build\outputs\apk\release\app-release.apk"
```

#### Option C: Manual Transfer (Simplest)
1. Copy APK file to phone (via USB or email)
2. Open file manager on phone
3. Tap the APK file
4. Tap "Install"

### After Installation
- App name: "Event Manager Mobile"
- Icon: Purple with gradient
- Test with credentials:
  - Email: john@example.com
  - Password: password123

## Troubleshooting

### Build Fails
- Check that Java is installed: `java -version`
- Check that Android SDK is at: `C:\Users\Lenovo\AppData\Local\Android\Sdk`
- Check internet connection (downloading 1-2 GB of dependencies)

### Installation Fails
- Enable USB Debugging: Settings → About Phone → Tap Build Number 7 times → Back → Developer Options → USB Debugging
- Use ADB: `adb devices` to see connected phones

### App won't connect to backend
- Backend must be running at: https://react-native-mern-project.onrender.com/api
- Check phone has internet connection

## Check Build Progress
Monitor the build with:
```powershell
Get-Content "C:\Users\Lenovo\Desktop\react native+mern\mobile\android\build-output.log" -Tail 20
```
