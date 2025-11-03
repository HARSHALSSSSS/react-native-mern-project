# Expo Tunnel vs Native Build - Comparison & Setup

## 📊 Quick Comparison

| Feature | Expo Tunnel | Native Build (Gradle) |
|---------|-------------|----------------------|
| **Setup Time** | 1 minute ⚡ | 10-30 minutes |
| **Build Time** | Instant | 5-15 minutes |
| **Testing** | Real device | Real device |
| **Production** | ❌ No | ✅ Yes |
| **Dependencies** | Expo Go app | Android SDK |
| **Hot Reload** | ✅ Yes | ✅ Yes |
| **Play Store** | ❌ No | ✅ Yes |
| **Distribution** | QR code | APK file |
| **Internet Required** | ✅ During dev | ❌ After build |

---

## 🎯 When to Use What

### Use Expo Tunnel When:
- 🔄 Rapid development & testing
- 📱 Quick team testing without installation
- 🏃 Time-sensitive debugging
- 🔗 Need QR code for sharing
- 🧪 Don't need Play Store deployment

### Use Native Build When:
- 📦 Ready for production
- 🎮 Need standalone APK
- 📤 Submitting to Play Store
- ⚙️ Testing native modules
- 📲 User installation required

---

## Part 1: Running with Expo Tunnel

### Current Status: ✅ ACTIVE

**Tunnel URL**: `exp://mlczuw0-harshal2626-8081.exp.direct`

### Setup (One-time)

1. **Install Expo Go**
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [Apple App Store](https://apps.apple.com/us/app/expo-go/id982107779)

2. **Start Tunnel**
   ```bash
   cd mobile
   npx expo start --tunnel
   ```

3. **Scan QR Code**
   - Open Expo Go app
   - Scan QR from terminal
   - App loads!

### Typical Workflow

```
Terminal 1: npx expo start --tunnel
                ↓
         QR code displayed
                ↓
        Scan with Expo Go
                ↓
        App loads in 5-10 sec
                ↓
      Make code changes
                ↓
      Hot reload auto-reloads
```

### Commands

```bash
# Start tunnel
npx expo start --tunnel

# Start with fresh cache
npx expo start --tunnel --clear

# Stop tunnel
Ctrl + C

# Reload app
Press 'r' in terminal or shake phone
```

---

## Part 2: Native Build with Gradle

### Prerequisites Check

```bash
# Check Java version (need 17+)
java -version

# Check Android SDK
echo %ANDROID_HOME%

# Check Gradle
cd mobile/android
./gradlew --version
```

### Setup Steps

#### Step 1: Prepare Environment

```bash
# Set environment variables (Windows PowerShell)
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\[USER]\AppData\Local\Android\sdk', 'User')
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Java\jdk-17', 'User')

# Verify
echo $env:ANDROID_HOME
echo $env:JAVA_HOME
```

#### Step 2: Build Debug APK

```bash
cd mobile
npm install --legacy-peer-deps

# Build
npx react-native build-android --mode=debug

# Or using Gradle directly
cd android
./gradlew assembleDebug
cd ..
```

**Output**: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Step 3: Install on Device

```bash
# Connect device via USB
# Enable USB Debugging on phone

# Verify connection
adb devices

# Install APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or:
adb install -r android/app/build/outputs/apk/debug/app-debug.apk  # (force reinstall)
```

#### Step 4: Run on Device

- APK automatically launches
- Or open app manually from app drawer
- Icon: "Event Manager Mobile"

### Build Options

**Debug Build** (for testing)
```bash
cd android
./gradlew assembleDebug
# Fast, includes debug symbols, ~50MB
```

**Release Build** (for Play Store)
```bash
cd android
./gradlew assembleRelease
# Slower, optimized, ~20MB
# Requires signing key
```

**Clean Build** (if issues)
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

---

## Part 3: Using Android Studio

### Open Project
1. Android Studio → Open → `mobile/android`
2. Wait for Gradle sync
3. Select `app` module

### Build via UI
1. Menu: Build → Generate Signed Bundle / APK
2. Select APK
3. Choose keystore or use debug signing
4. Select build variant (debug/release)
5. Finish → APK generated

### Install via Android Studio
1. Menu: Run → Run 'app'
2. Select connected device
3. App builds & installs automatically

---

## Typical Build Commands

### Develop & Test (Expo)
```bash
npx expo start --tunnel
# Dev cycle: edit → save → auto-reload
```

### Quick Test Build
```bash
npm install --legacy-peer-deps
npx react-native build-android --mode=debug
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Production Build
```bash
cd android
./gradlew bundleRelease  # For Play Store (AAB format)
./gradlew assembleRelease  # For direct APK
```

---

## Build Configuration

### File: `android/app/build.gradle`

Key settings:
```groovy
android {
    compileSdk 34
    defaultConfig {
        applicationId 'com.eventmanagement.mobile'
        minSdkVersion 24
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

### File: `app.json`

Key settings:
```json
{
  "expo": {
    "name": "Event Manager Mobile",
    "sdkVersion": "51.0.0",
    "android": {
      "package": "com.eventmanagement.mobile"
    }
  }
}
```

---

## Troubleshooting

### Expo Tunnel Issues

**"Cannot connect to tunnel"**
```bash
# Clear cache and retry
rm -r .expo
npx expo start --tunnel --clear
```

**"App crashes on scan"**
```bash
# Reinstall Expo Go
# Or try different Expo Go version
```

### Gradle Build Issues

**"Android SDK not found"**
```bash
# Install Android SDK via Android Studio
# Or set ANDROID_HOME correctly
setx ANDROID_HOME "C:\Users\[USER]\AppData\Local\Android\sdk"
```

**"Gradle build failed"**
```bash
cd android
./gradlew clean
./gradlew assembleDebug --info  # See detailed errors
```

**"Java version error"**
```bash
# Install Java 17+
# Download from oracle.com/java or use OpenJDK

# Set JAVA_HOME
setx JAVA_HOME "C:\Program Files\Java\jdk-17"
```

**"ADB not found"**
```bash
# Add Android SDK tools to PATH
# Android Studio → Settings → SDK Manager → SDK Tools
# Check "Android SDK Platform-Tools"
```

---

## Performance Tips

### Faster Builds
1. Use debug builds during development
2. Clean only when necessary: `./gradlew clean`
3. Enable Gradle daemon (automatic in most cases)

### Faster Expo
1. Clear cache periodically: `npx expo start --tunnel --clear`
2. Kill previous tunnel before starting new one
3. Use Wi-Fi instead of hotspot for better speeds

### Faster Development
1. Use hot reload (automatic in both modes)
2. Keep terminal window visible
3. Have device connected and ready

---

## Testing Checklist

### Expo Tunnel Testing
- [ ] App loads via QR scan
- [ ] Login works
- [ ] Events list loads
- [ ] Event search works
- [ ] Can view event details
- [ ] Booking flow completes
- [ ] My bookings displays
- [ ] Profile works
- [ ] Logout works
- [ ] App doesn't crash on reload

### Native Build Testing
- [ ] APK installs successfully
- [ ] App launches
- [ ] All above features work
- [ ] No permission errors
- [ ] Database connectivity works
- [ ] Images load correctly
- [ ] Navigation smooth
- [ ] Performance acceptable
- [ ] No crash on background/foreground

---

## Distribution Comparison

### Sharing App

**Expo Tunnel**:
```
👤 User → Scan QR Code → Expo Go → App loads
✅ Instant
✅ No installation
✅ Easy sharing
❌ Requires internet
❌ No Play Store
```

**Native Build**:
```
👤 User → Get APK file → Install → App launches
✅ Standalone
✅ Play Store ready
✅ Works offline
❌ Larger (~50MB)
❌ Need build steps
```

---

## Next Steps

1. **Start with Expo**: `npx expo start --tunnel`
2. **Test features** and verify everything works
3. **Build native APK** when ready
4. **Deploy to Play Store** for production

---

## Summary

- **For Development**: Use Expo Tunnel (faster, simpler)
- **For Production**: Use Native Build (real APK, Play Store ready)
- **Both Recommended**: Test both to ensure compatibility

Both methods are fully configured and ready to use!

For detailed information:
- See `QUICK_START.md` for fastest setup
- See `NATIVE_BUILD_GUIDE.md` for detailed APK building
- See `PROJECT_COMPLETION_SUMMARY.md` for full feature list
