# Testing Real-Time Sync Between Admin & Mobile

## Quick Test Guide

### Setup
- ✅ Admin Dashboard: https://react-native-mern-project.vercel.app
- ✅ Mobile App: Running in Expo Go or built APK
- ✅ Backend: https://react-native-mern-project.onrender.com

---

## Test 1: Create Event and See in Mobile (Auto-Sync)

### Steps:
1. **Mobile App**: Open and go to **Home** tab
2. **Admin Dashboard**: Open in browser (logged in)
3. **Admin Dashboard**: Click **"Create Event"** button
4. **Admin Dashboard**: Fill in form:
   - Title: "Test Event - Auto Sync"
   - Description: "Testing automatic sync"
   - Category: Select any (e.g., "Music")
   - Venue: Select any
   - Date: Pick future date
   - Time: Any time
   - Capacity: 100
   - Price: 50
5. **Admin Dashboard**: Click **"Create Event"**
6. **Mobile App**: **Wait 30 seconds or less** - Event should appear! ✅

### What to Look For:
- "Test Event - Auto Sync" appears in mobile event list
- No manual refresh needed
- Should appear within 30 seconds

---

## Test 2: Pull-to-Refresh for Instant Update

### Steps:
1. **Mobile App**: Open **Home** tab
2. **Admin Dashboard**: Create another event:
   - Title: "Test Event - Pull Refresh"
   - (Fill other required fields)
3. **Mobile App**: **Pull down** on event list
4. **Mobile App**: New event should appear immediately! ✅

### What to Look For:
- Pull-to-refresh animation appears
- Event list refreshes
- New event appears instantly

---

## Test 3: Edit Event and See Changes

### Steps:
1. **Mobile App**: Note any event details (e.g., price)
2. **Admin Dashboard**: Find that event in the list
3. **Admin Dashboard**: Click **Edit** button
4. **Admin Dashboard**: Change the **Price** (e.g., from 50 to 75)
5. **Admin Dashboard**: Click **"Update Event"**
6. **Mobile App**: **Pull down** to refresh
7. **Mobile App**: Price should be updated! ✅

---

## Test 4: Delete Event and See Removal

### Steps:
1. **Mobile App**: See event list with several events
2. **Admin Dashboard**: Find any event
3. **Admin Dashboard**: Click **Delete** button
4. **Admin Dashboard**: Confirm deletion
5. **Mobile App**: **Wait 30 seconds** or **pull down** to refresh
6. **Mobile App**: Event should be gone! ✅

---

## Test 5: Monitor Polling Activity

### In Mobile Console:
1. Open mobile app in Expo Go or dev environment
2. Watch the console logs
3. Every 30 seconds you should see: `"Auto-refreshing events..."`
4. Then API call will be made to fetch events

### Check Logs:
```
Auto-refreshing events...
Auto-refreshing events...
Auto-refreshing events...
(repeats every 30 seconds)
```

---

## Scenarios to Test

### Scenario 1: Multiple Events
- Create 5-10 events in admin dashboard
- All should appear in mobile app within 30 seconds

### Scenario 2: Rapid Changes
- Update same event multiple times quickly
- Mobile app should always show latest version

### Scenario 3: Different Event Types
- Create events in different categories
- All should sync properly

### Scenario 4: Large Data
- Create event with long description, high capacity
- Should handle well without issues

---

## Performance Checklist

- [ ] Events appear within 30 seconds (auto-sync)
- [ ] Events appear instantly with pull-refresh
- [ ] No lag or delays in mobile app
- [ ] Pull-to-refresh works smoothly
- [ ] No duplicate events in list
- [ ] Deleted events are removed properly
- [ ] App doesn't crash during sync

---

## Troubleshooting During Testing

| Issue | Solution |
|-------|----------|
| Event not appearing after 30 sec | Pull down to refresh manually |
| Event appearing multiple times | Clear app cache and restart |
| Pull-to-refresh not working | Check API connectivity |
| App crashes on refresh | Check console for errors |
| Very slow sync | Check internet connection |

---

## Expected Behavior Summary

| Action | Result | Time |
|--------|--------|------|
| Admin creates event | Appears in mobile | < 30 sec |
| Admin updates event | Changes sync to mobile | < 30 sec |
| Admin deletes event | Disappears from mobile | < 30 sec |
| User pulls to refresh | Instant update | < 2 sec |
| App regains focus | Auto-refreshes | Automatic |
| App loses focus | Stops polling | Automatic |

---

## Success Criteria ✅

If you can answer "YES" to all these, real-time sync is working:

1. ✅ Can create event in admin dashboard
2. ✅ Event appears in mobile app within 30 seconds
3. ✅ Can pull down to refresh and see instant updates
4. ✅ Can update event and see changes in mobile
5. ✅ Can delete event and see it removed from mobile
6. ✅ App automatically stops polling when not in focus
7. ✅ App automatically resumes polling when in focus

---

## Recording Test Results

**Date**: ___________
**Tester**: ___________

| Test | Passed | Notes |
|------|--------|-------|
| Auto-sync (30 sec) | [ ] Yes [ ] No | |
| Pull-to-refresh | [ ] Yes [ ] No | |
| Edit sync | [ ] Yes [ ] No | |
| Delete sync | [ ] Yes [ ] No | |
| Polling activity | [ ] Yes [ ] No | |
| Multiple events | [ ] Yes [ ] No | |
| No crashes | [ ] Yes [ ] No | |

---

## Questions?

If real-time sync is not working:
1. Check mobile console for errors
2. Check backend Render logs for API errors
3. Verify CORS settings are correct
4. Ensure both apps are pointing to correct URLs
5. Try restarting mobile app

