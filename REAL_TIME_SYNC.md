# Real-Time Sync Between Admin & Mobile App

## Overview
When an admin creates, updates, or deletes an event on the web dashboard, it will automatically sync with the mobile app through multiple mechanisms.

---

## Sync Mechanisms Implemented

### 1. **Auto-Refresh Polling** ✅ (Currently Active)
- Mobile app automatically refreshes events every **30 seconds**
- When HomeScreen comes into focus, polling starts
- When HomeScreen loses focus, polling stops
- **User Impact**: Events appear automatically within 30 seconds
- **Battery Impact**: Low (one request every 30 seconds)

### 2. **Pull-to-Refresh** ✅ (Currently Active)
- Users can manually pull down to refresh instantly
- Shows loading spinner during refresh
- **User Impact**: Instant updates on demand

### 3. **Focus-based Refresh** ✅ (Currently Active)
- When user returns to HomeScreen tab, it refreshes events
- Events are fetched fresh each time user navigates back

---

## How It Works

### Admin Creates Event:
1. Admin opens web dashboard (https://react-native-mern-project.vercel.app)
2. Clicks "Create Event" and fills form
3. Event is saved to MongoDB
4. Mobile app detects new event in next 30-second poll
5. Event appears in user's event list automatically

### Admin Updates Event:
1. Admin clicks "Edit" on existing event
2. Makes changes and saves
3. Mobile app picks up changes in next poll cycle

### Admin Deletes Event:
1. Admin clicks "Delete" and confirms
2. Event removed from database
3. Mobile app removes it from list in next poll

---

## Architecture

```
Admin Web Dashboard (Vercel)
         ↓ (Create/Update/Delete)
   Backend API (Render)
         ↓ (Stores to MongoDB)
   MongoDB Atlas
         ↓ (Every 30 seconds)
   Mobile App (Polling)
         ↓
   User sees new events
```

---

## Configuration

### Current Polling Interval: 30 seconds
- Location: `mobile/src/screens/HomeScreen.js`, line 27
- To change: Update `30000` to desired milliseconds

**Examples:**
- 10 seconds: `10000` (more real-time, higher battery usage)
- 60 seconds: `60000` (less real-time, better battery)
- 5 minutes: `300000` (very battery efficient)

---

## Future Enhancements

### Option A: WebSocket/Socket.io (Real-time)
- Events sync instantly (< 1 second)
- Requires backend changes and Socket.io library
- Estimated effort: Medium

### Option B: Push Notifications
- Admin creates event → Firebase notification sent to all users
- Users receive badge notification with event details
- Most user-friendly
- Estimated effort: Medium

### Option C: Smart Polling
- Increase polling interval when app is in background
- Decrease when app is in foreground
- Balance battery and real-time feel
- Estimated effort: Low

---

## Testing Real-Time Sync

1. **Open mobile app** and navigate to Home tab
2. **Open admin dashboard** in another window
3. **Create a new event** in the admin dashboard
4. **Watch mobile app** - event should appear within 30 seconds
5. **Or pull down** to refresh manually for instant update

---

## Monitoring

### Check Polling Activity:
- Open mobile app console logs
- Look for: `"Auto-refreshing events..."`
- Appears every 30 seconds when HomeScreen is active

### Check API Calls:
- Go to backend Render logs
- Look for: `GET /api/events` requests
- Should see one every 30 seconds

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Sync Latency (max) | 30 seconds |
| Sync Latency (with pull) | < 1 second |
| API Calls per minute | 2 (one per 30 sec) |
| Data used per day | ~2-5 MB |
| Battery impact | Negligible |

---

## Known Limitations

1. **Not instant** - Up to 30 second delay on automatic sync
2. **Polling only** - No server-to-client push notifications
3. **No conflicts** - If admin and user both modify same data, admin wins

---

## Troubleshooting

### Events not syncing:
1. Check mobile app logs for polling activity
2. Verify backend API is accessible from mobile
3. Check CORS settings on backend (already configured)
4. Hard restart mobile app

### High battery usage:
1. Reduce polling interval (currently 30 seconds is reasonable)
2. Implement background polling restrictions

### Too many API calls:
1. Increase polling interval
2. Implement incremental sync (only fetch new events)

---

## Implementation Details

### HomeScreen.js Changes:
- Added `useFocusEffect` to start/stop polling based on screen focus
- Added `pollingIntervalRef` to manage interval lifecycle
- Added auto-refresh every 30 seconds
- Separated `loading` and `refreshing` states

### Why This Approach?
- ✅ Works with existing architecture (no backend changes needed)
- ✅ Battery efficient (30 second interval)
- ✅ User-friendly (instant pull-to-refresh option)
- ✅ Scales well (simple HTTP polling)
- ✅ Reliable (no WebSocket complexity)

---

## Next Steps (Optional Improvements)

1. **Add notification badge** - Show new events count
2. **Implement incremental sync** - Only fetch updated events
3. **Add local caching** - Reduce API calls
4. **Implement WebSockets** - For true real-time sync
5. **Add push notifications** - For better UX

