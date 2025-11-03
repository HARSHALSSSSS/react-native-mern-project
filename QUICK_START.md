# 🚀 Event Management System - Quick Start Guide

## In 5 Minutes: Get the App Running

### Option 1: Expo Tunnel (Fastest ⚡)
No build needed! Test on your phone in seconds.

```bash
cd "c:\Users\Lenovo\Desktop\react native+mern\mobile"
npx expo start --tunnel
```
✅ **Scan the QR code with Expo Go app → App loads!**

---

### Option 2: Native Android Build (Complete 🔧)
Build a real APK for production/Play Store.

```bash
cd "c:\Users\Lenovo\Desktop\react native+mern\mobile"
npm install --legacy-peer-deps
npx react-native build-android --mode=debug
# APK at: android/app/build/outputs/apk/debug/app-debug.apk
```

Or use Android Studio:
1. Open `mobile/android` in Android Studio
2. Click Build → Generate APK
3. Select debug/release variant
4. Done!

---

## Running All Services

### Backend (Node.js API)
```bash
cd backend
npm install
npm run dev
# API running at http://localhost:5000/api
```

### Web Admin Panel (React)
```bash
cd web
npm install
npm start
# Dashboard at http://localhost:3000
```

### Mobile App
**Expo**: See Option 1 above
**Native**: See Option 2 above

---

## Test Credentials

**Web Admin Login**:
```
Email: admin@example.com
Password: password123
```

**Mobile User Login**:
```
Email: john@example.com
Password: password123
```

Or create new accounts via sign-up screens.

---

## Key URLs

| Service | URL | Status |
|---------|-----|--------|
| Backend API | https://react-native-mern-project.onrender.com/api | ✅ Live |
| Web Admin | https://react-native-mern-project.vercel.app | ✅ Live |
| Mobile - Expo | exp://mlczuw0-harshal2626-8081.exp.direct | ✅ Tunnel Running |
| Mobile - Android | APK from Gradle build | ✅ Ready |

---

## What's Included

### Web Admin Panel ✅
- Event management (Create, Edit, Delete)
- Category & Venue management
- Dashboard with statistics
- View event participants
- Export bookings as CSV

### Mobile App ✅
- User authentication
- Browse upcoming events
- Search & filter
- Book tickets
- My bookings with QR codes
- Check-in at events
- Profile management

### Backend API ✅
- All CRUD operations
- JWT authentication
- QR code generation
- Email notifications
- Check-in functionality
- Statistics & reporting

---

## Troubleshooting

**Expo not connecting?**
```bash
npx expo start --tunnel --clear
```

**Dependencies error?**
```bash
npm install --legacy-peer-deps
```

**Backend not starting?**
- Check `.env` has `MONGODB_URI`
- Verify port 5000 is free

**Build failing on Android?**
```bash
cd mobile/android
./gradlew clean
./gradlew assembleDebug
```

---

## Documentation

- 📖 `PROJECT_COMPLETION_SUMMARY.md` - Full feature list
- 📖 `NATIVE_BUILD_GUIDE.md` - APK build steps
- 📖 `AUDIT_AND_IMPLEMENTATION.md` - Implementation details

---

## Next Steps

1. **Test Expo Tunnel** - Scan QR with phone
2. **Explore Web Admin** - Manage events
3. **Book Tickets** - Test full booking flow
4. **Build APK** - Follow native build guide
5. **Deploy to Play Store** - (Optional)

---

## 🎯 Project Status: ✅ COMPLETE

All 4 modules implemented and tested.
Ready for production use!

For detailed information, see `PROJECT_COMPLETION_SUMMARY.md`
