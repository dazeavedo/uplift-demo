# Mobile App Documentation

## Overview

The Uplift mobile app is built with React Native and Expo, providing a native experience for iOS and Android. It supports both worker and manager roles with automatic UI switching based on user permissions.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.73+ | Core framework |
| Expo SDK | 50+ | Development & build |
| TypeScript | 5.0+ | Type safety |
| React Navigation | 6.x | Navigation |
| AsyncStorage | Latest | Local storage |
| NetInfo | Latest | Connectivity detection |

---

## Project Structure

```
mobile/
├── App.tsx                    # Entry point
├── app.config.js             # Expo configuration
├── src/
│   ├── navigation/
│   │   └── AppNavigation.tsx  # Navigation setup
│   ├── screens/
│   │   ├── HomeScreen.tsx     # Worker home
│   │   ├── LoginScreen.tsx    # Authentication
│   │   ├── schedule/          # Schedule screens
│   │   │   ├── ScheduleOverviewScreen.tsx
│   │   │   ├── ShiftDetailScreen.tsx
│   │   │   ├── ClockInOutScreen.tsx
│   │   │   ├── ShiftSwapScreen.tsx
│   │   │   └── TimeOffRequestScreen.tsx
│   │   ├── manager/           # Manager screens
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── ScheduleBuilderScreen.tsx
│   │   │   ├── TeamScheduleScreen.tsx
│   │   │   ├── SkillsVerificationScreen.tsx
│   │   │   ├── JobPostingsScreen.tsx
│   │   │   ├── ExpenseApprovalsScreen.tsx
│   │   │   └── ReportsScreen.tsx
│   │   ├── career/            # Career screens
│   │   ├── tasks/             # Task screens
│   │   ├── gamification/      # Rewards screens
│   │   └── onboarding/        # Onboarding flow
│   ├── components/
│   │   ├── Icons.tsx          # SVG icon components
│   │   ├── Button.tsx         # Button component
│   │   ├── Skeleton.tsx       # Loading skeletons
│   │   ├── Logo.tsx           # Uplift logo
│   │   └── OfflineIndicators.tsx  # Offline UI
│   ├── services/
│   │   ├── api.ts             # API client
│   │   └── offline.ts         # Offline support
│   ├── hooks/
│   │   ├── useData.ts         # Data fetching hooks
│   │   ├── useOffline.ts      # Offline state hooks
│   │   └── index.ts           # Exports
│   ├── store/
│   │   └── authStore.ts       # Auth state (Zustand)
│   ├── theme/
│   │   └── index.ts           # Colors, typography, spacing
│   └── constants/
│       └── ukLocations.ts     # UK location data
```

---

## Running the App

### Development

```bash
cd mobile

# Install dependencies
npm install

# Start Expo
npx expo start

# Options in Expo CLI:
# i - Open iOS Simulator
# a - Open Android Emulator
# w - Open web browser
# Scan QR - Open on physical device with Expo Go
```

### Building for Production

```bash
# iOS
npx expo build:ios

# Android
npx expo build:android

# Using EAS Build (recommended)
npx eas build --platform ios
npx eas build --platform android
```

---

## Configuration

### app.config.js

```javascript
export default {
  expo: {
    name: 'Uplift',
    slug: 'uplift',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#FF6B35'
    },
    ios: {
      bundleIdentifier: 'com.uplift.app',
      supportsTablet: true
    },
    android: {
      package: 'com.uplift.app',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FF6B35'
      }
    },
    extra: {
      apiUrl: process.env.API_URL || 'https://api.uplift.hr/api',
      environment: process.env.NODE_ENV || 'development'
    }
  }
};
```

---

## Navigation Structure

```
RootNavigator
├── AuthStack (unauthenticated)
│   ├── Login
│   ├── Register
│   └── ForgotPassword
│
└── MainStack (authenticated)
    ├── TabNavigator
    │   ├── Home (worker) / Dashboard (manager)
    │   ├── Schedule
    │   ├── Jobs
    │   ├── Career
    │   └── Profile
    │
    └── Modal Screens
        ├── ShiftDetail
        ├── ClockInOut
        ├── ShiftSwap
        ├── TimeOffRequest
        ├── Notifications
        ├── ScheduleBuilder (manager)
        ├── SkillsVerification (manager)
        └── Reports (manager)
```

---

## Authentication

### Auth Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │────▶│  API Call   │────▶│  Store      │
│   Screen    │     │  /auth/login│     │  Token      │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  Navigate   │
                                        │  to Main    │
                                        └─────────────┘
```

### Auth Store (Zustand)

```typescript
// src/store/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
```

### Protected Routes

```typescript
// In AppNavigation.tsx
const { isAuthenticated, isLoading } = useAuthStore();

if (isLoading) {
  return <SplashScreen />;
}

return (
  <NavigationContainer>
    {isAuthenticated ? <MainStack /> : <AuthStack />}
  </NavigationContainer>
);
```

---

## Offline Support

The app supports full offline functionality for critical operations:

### Cached Data
- User profile
- Upcoming shifts (7 days)
- Skills list
- Recent notifications

### Offline Actions
- Clock in/out
- Start/end break
- View cached schedule
- View cached profile

### Sync Behavior

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Action    │────▶│  Check      │────▶│  Online?    │
│   Triggered │     │  Network    │     │             │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                         ┌─────────────────────┴─────────────────────┐
                         │                                           │
                         ▼                                           ▼
                  ┌─────────────┐                            ┌─────────────┐
                  │   Execute   │                            │  Queue      │
                  │   Directly  │                            │  Action     │
                  └─────────────┘                            └──────┬──────┘
                                                                    │
                                                                    ▼
                                                            ┌─────────────┐
                                                            │  Show Toast │
                                                            │  "Saved"    │
                                                            └──────┬──────┘
                                                                   │
                                                            [When Online]
                                                                   │
                                                                   ▼
                                                            ┌─────────────┐
                                                            │  Sync Queue │
                                                            │  to Server  │
                                                            └─────────────┘
```

### Using Offline Hooks

```typescript
import { useOffline, useOfflineSchedule, useClockIn } from '../hooks/useOffline';

function MyScreen() {
  // Connectivity state
  const { isOnline, queueLength, isSyncing, sync } = useOffline();

  // Data with cache fallback
  const { data: schedule, loading, fromCache } = useOfflineSchedule('2024-01-20', '2024-01-26');

  // Offline-capable action
  const { execute: clockIn, loading: clockingIn, queued } = useClockIn();

  const handleClockIn = async () => {
    const result = await clockIn({ shiftId: '123' });
    if (result.queued) {
      // Action saved for sync
    }
  };

  return (
    <View>
      {!isOnline && <OfflineBanner />}
      {fromCache && <Text>Showing cached data</Text>}
      {queueLength > 0 && <Text>{queueLength} pending actions</Text>}
    </View>
  );
}
```

---

## Theme System

### Colors

```typescript
// src/theme/index.ts
export const colors = {
  // Brand
  momentum: '#FF6B35',      // Momentum Orange
  momentumDark: '#E55A2B',
  momentumLight: '#FF8A5B',

  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Neutrals
  background: '#FFFFFF',
  surface: '#F8FAFC',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate900: '#0F172A',
};
```

### Typography

```typescript
export const typography = {
  h1: { fontSize: 28, fontWeight: '800', lineHeight: 34 },
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 30 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyBold: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
};
```

### Spacing

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};
```

---

## API Integration

### API Client

```typescript
// src/services/api.ts
class ApiService {
  private accessToken: string | null = null;

  async request<T>(method: string, path: string, data?: any): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.json());
    }

    return response.json();
  }

  // Convenience methods
  async getShifts(params: { startDate: string; endDate: string }) { ... }
  async clockIn(data: { shiftId?: string; location?: GeoLocation }) { ... }
  async clockOut(data: { location?: GeoLocation }) { ... }
  // ... more methods
}

export const api = new ApiService();
```

### Data Fetching Hook

```typescript
// src/hooks/useData.ts
export function useShifts(startDate: string, endDate: string) {
  const [data, setData] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadShifts();
  }, [startDate, endDate]);

  const loadShifts = async () => {
    try {
      setLoading(true);
      const result = await api.getShifts({ startDate, endDate });
      setData(result.shifts);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refresh: loadShifts };
}
```

---

## Role-Based UI

The app automatically switches UI based on user role:

### Worker Experience
- Home: Today's shift, quick actions, momentum score
- Schedule: Week view, shift details, swap requests
- Jobs: Internal opportunities, applications
- Career: Skills progress, career path
- Profile: Settings, notifications

### Manager Experience
- Dashboard: Team metrics, AI insights, pending actions
- Schedule Builder: Drag-drop scheduling, AI Fill
- Team Schedule: All team shifts, approvals
- Skills Verification: Pending verifications
- Job Postings: Manage internal postings
- Reports: Analytics, exports

### Implementation

```typescript
// In navigation
const { user } = useAuthStore();
const isManager = user?.role === 'manager' || user?.role === 'admin';

<Tab.Navigator>
  <Tab.Screen 
    name="Home" 
    component={isManager ? ManagerDashboardScreen : WorkerHomeScreen} 
  />
  {/* More tabs... */}
</Tab.Navigator>
```

---

## Push Notifications

### Setup (Expo)

```typescript
import * as Notifications from 'expo-notifications';

// Request permissions
const { status } = await Notifications.requestPermissionsAsync();

// Get push token
const token = await Notifications.getExpoPushTokenAsync();

// Send to backend
await api.registerPushToken(token.data);
```

### Notification Types
- Shift reminders
- Shift swap requests
- Time off approvals
- New job postings
- Skills verified
- Schedule changes

---

## Performance Optimization

### Image Optimization
- Use `expo-image` for optimized loading
- Cache images locally
- Use appropriate resolutions

### List Optimization
```typescript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
/>
```

### Memoization
```typescript
const MemoizedCard = React.memo(ShiftCard);

const renderItem = useCallback(({ item }) => (
  <MemoizedCard shift={item} />
), []);
```

---

## Testing

### Unit Tests

```bash
npm test
```

### E2E Tests (Detox)

```bash
# iOS
detox test --configuration ios.sim.debug

# Android
detox test --configuration android.emu.debug
```

---

## Common Issues

### Metro Bundler Issues
```bash
# Clear cache
npx expo start --clear

# Reset Metro
rm -rf node_modules/.cache
```

### iOS Simulator Issues
```bash
# Reset simulator
xcrun simctl erase all
```

### Android Emulator Issues
```bash
# Cold boot
emulator -avd Pixel_4_API_33 -no-snapshot
```

---

## App Store Submission

### iOS (App Store Connect)
1. Build with EAS: `npx eas build --platform ios`
2. Submit: `npx eas submit --platform ios`
3. Complete App Store Connect listing
4. Submit for review

### Android (Google Play Console)
1. Build with EAS: `npx eas build --platform android`
2. Submit: `npx eas submit --platform android`
3. Complete Play Console listing
4. Submit for review

### Required Assets
- App icon (1024x1024)
- Screenshots (various sizes)
- Feature graphic (Android)
- Privacy policy URL
- Support email
