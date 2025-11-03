# Event Management System - Build Guide

## Building for Both Expo Tunnel & Native Android (Gradle/APK)

This guide covers how to run the app in both modes:
1. **Expo Tunnel** (Quick testing, no build needed)
2. **Native React Native Build** (Android APK via Gradle)

---

## Part 1: Running via Expo Tunnel (Fast & Easy)

### Prerequisites
- Node.js v20+
- Expo Go app installed on Android phone
- Active internet connection

### Steps

1. **Navigate to mobile directory**
   ```bash
   cd "c:\Users\Lenovo\Desktop\react native+mern\mobile"
   ```

2. **Start Expo tunnel**
   ```bash
   npx expo start --tunnel
   ```

3. **Scan QR Code**
   - Open Expo Go app on Android phone
   - Scan the QR code displayed in terminal
   - App will load automatically

### Current Tunnel Status
- **SDK Version**: 51.0.0
- **React Native**: 0.74.0
- **Current QR**: exp://mlczuw0-harshal2626-8081.exp.direct

---

## Part 2: Native Android Build (Gradle/APK)

### Prerequisites
- Android Studio installed (latest version)
- Android SDK (API level 34+ recommended)
- Gradle wrapper (included in project)
- Java Development Kit (JDK 17+)
- environment variables set (ANDROID_HOME, JAVA_HOME)

### Current Build Configuration

**File**: `mobile/android/app/build.gradle`
- Package: `com.eventmanagement.mobile`
- Min SDK: 24
- Target SDK: 34
- Version: 1.0.0

**File**: `mobile/app.json`
- Expo SDK: 51.0.0
- Orientation: Portrait
- Android-only build

### Build Steps

#### Step 1: Prepare Project
```bash
cd "c:\Users\Lenovo\Desktop\react native+mern\mobile"
npm install --legacy-peer-deps
```

#### Step 2: Build Debug APK
```bash
npx react-native build-android --mode=debug
```

Or using Gradle directly:
```bash
cd android
./gradlew assembleDebug
```

APK Output: `app/build/outputs/apk/debug/app-debug.apk`

#### Step 3: Build Release APK
```bash
cd android
./gradlew assembleRelease
```

APK Output: `app/build/outputs/apk/release/app-release.apk`

#### Step 4: Install on Device
```bash
# Make sure device is connected via ADB
adb devices

# Install APK
adb install "path/to/app.apk"
```

### Alternative: Use Android Studio

1. Open `mobile/android` in Android Studio
2. Select `Build` → `Generate Signed Bundle / APK`
3. Choose APK format
4. Configure signing key or use debug signing
5. Select build variant (debug/release)
6. Click Generate

---

## Troubleshooting

### Issue: Gradle build fails with "Cannot find module"
**Solution**: Run `npm install --legacy-peer-deps` in mobile directory

### Issue: Build fails with Java version error
**Solution**: Install JDK 17+
```bash
# Check Java version
java -version

# Set JAVA_HOME environment variable
setx JAVA_HOME "C:\Program Files\Java\jdk-17"
```

### Issue: Build fails with Android SDK error
**Solution**: Ensure ANDROID_HOME is set
```bash
# Set ANDROID_HOME
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\sdk"
```

### Issue: ADB device not found
**Solution**: Enable USB debugging on phone
- Settings → Developer Options → USB Debugging
- Connect phone via USB
- Run `adb devices` to verify

### Issue: Expo tunnel connection fails
**Solution**: 
- Check internet connection
- Clear Expo cache: `rm -r .expo`
- Restart tunnel: `npx expo start --tunnel --clear`

---

## Project Structure

```
mobile/
├── android/                 # Native Android code & Gradle config
│   ├── app/
│   │   ├── build.gradle    # Gradle build configuration
│   │   └── src/            # Java/Kotlin source
│   ├── gradle/             # Gradle wrapper
│   └── build.gradle        # Project-level Gradle config
├── src/                    # React Native source
│   ├── screens/            # App screens
│   ├── services/           # API services
│   ├── context/            # Auth context
│   └── styles/             # Theme & styling
├── app.json                # Expo configuration
├── package.json            # Dependencies
└── metro.config.js         # Metro bundler config
```

---

## Development & Testing

### Test on Both Platforms Simultaneously

Terminal 1 - Expo Tunnel:
```bash
cd mobile
npx expo start --tunnel
```

Terminal 2 - Native Build:
```bash
cd mobile/android
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

### Testing Checklist

- [ ] App loads without errors on Expo Go
- [ ] All screens render correctly
- [ ] Navigation works (tabs, stack)
- [ ] Login/signup works
- [ ] Event list loads
- [ ] Event search/filter works
- [ ] Booking flow completes
- [ ] QR code displays
- [ ] App loads without errors on native build
- [ ] All features work on native build

---

## Production Deployment

### For App Store / Play Store

1. **Prepare signing key** (if not already done)
   ```bash
   keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias eventmgr
   ```

2. **Configure signing in build.gradle**
   ```groovy
   signingConfigs {
       release {
           storeFile file("release.keystore")
           storePassword System.getenv("KEYSTORE_PASSWORD")
           keyAlias System.getenv("KEY_ALIAS")
           keyPassword System.getenv("KEY_PASSWORD")
       }
   }
   ```

3. **Build release APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. **Upload to Google Play Store**
   - Use Google Play Console
   - Upload signed APK
   - Fill in app details
   - Submit for review

---

## Performance Optimization

### Metro Bundler Cache
- Clear cache: `npx expo start --tunnel --clear`
- Improves rebuild time

### Gradle Build Cache
- Location: `mobile/android/.gradle/`
- Clear with: `./gradlew clean`

### Enable Hermes Engine
- Edit `android/app/build.gradle`
- Set `enableHermes: true`
- Faster startup & smaller bundle

---

## Environment Variables

Create `.env` file in mobile directory:
```
EXPO_PUBLIC_API_BASE_URL=https://react-native-mern-project.onrender.com/api
```

---

## Useful Commands

```bash
# Start Expo tunnel
npx expo start --tunnel

# List connected Android devices
adb devices

# View device logs in real-time
adb logcat

# Install APK on device
adb install app.apk

# Uninstall app
adb uninstall com.eventmanagement.mobile

# Clean Gradle build cache
./gradlew clean

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# Run tests
npm test

# Eject from Expo (only if needed)
expo eject
```

---

## Next Steps

1. ✅ Expo tunnel is working
2. ⏳ Test native build with Gradle
3. ⏳ Generate APK for team testing
4. ⏳ Deploy to Play Store (optional)

For issues, check the troubleshooting section or review Gradle logs.
