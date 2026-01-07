// Mock data for hybrid demo - feels real, works offline

export const users = {
  worker: {
    id: 'w1',
    name: 'Marc Hunt',
    initials: 'MH',
    role: 'Server',
    location: 'Urban Eats Downtown',
    tenure: '8 months',
    points: 1282,
    level: 'Silver Level 4',
    levelProgress: 68,
    pointsToNext: 600,
    streak: 12,
    attendance: 96,
    tasksCompleted: 247,
    email: 'marc.hunt@demo.uplift.com'
  },
  manager: {
    id: 'm1',
    name: 'Sarah Chen',
    initials: 'SC',
    role: 'General Manager',
    location: 'Urban Eats Downtown',
    email: 'sarah.chen@demo.uplift.com'
  }
};

export const shifts = [
  {
    id: 's1',
    date: '2026-01-10',
    dayName: 'Friday',
    startTime: '17:00',
    endTime: '23:00',
    duration: 6,
    location: 'Urban Eats Downtown',
    role: 'Server',
    pay: 105,
    distance: '0.5 mi',
    weather: { temp: 18, condition: 'Sunny', icon: '☀️' },
    team: [
      { name: 'Jessica Bano', initials: 'JB', role: 'Bartender', time: '5-11pm' },
      { name: 'Thomas Cane', initials: 'TC', role: 'Line Cook', time: '5-11pm' },
      { name: 'Sarah Chen', initials: 'SC', role: 'Manager', time: '2-10pm' }
    ],
    status: 'confirmed'
  },
  {
    id: 's2',
    date: '2026-01-11',
    dayName: 'Saturday',
    startTime: '11:00',
    endTime: '19:00',
    duration: 8,
    location: 'Urban Eats Westside',
    role: 'Server',
    pay: 120,
    distance: '2.8 mi',
    status: 'confirmed'
  },
  {
    id: 's3',
    date: '2026-01-12',
    dayName: 'Sunday',
    startTime: '14:00',
    endTime: '22:00',
    duration: 8,
    location: 'Urban Eats Northgate',
    role: 'Server',
    pay: 120,
    distance: '3.2 mi',
    status: 'confirmed'
  }
];

export const jobs = [
  {
    id: 'j1',
    title: 'Shift Supervisor',
    location: 'Urban Eats Downtown',
    currentSalary: 31200,
    newSalary: 38480,
    currentHourly: 15,
    newHourly: 18.50,
    increase: 7280,
    increasePercent: 23,
    match: 85,
    timeToReady: '6-8 weeks',
    skills: [
      { name: 'Customer Service', status: 'complete', progress: 100 },
      { name: 'Team Leadership', status: 'inProgress', progress: 30 },
      { name: 'Conflict Resolution', status: 'needed', progress: 0 }
    ],
    description: 'Lead a team of 5-8 servers, manage floor operations, handle escalations',
    posted: '2 hours ago'
  }
];

export const applications = [
  {
    id: 'a1',
    jobId: 'j1',
    jobTitle: 'Shift Supervisor',
    location: 'Urban Eats Downtown',
    salary: 38480,
    appliedDate: '5 days ago',
    status: 'interview',
    timeline: [
      { step: 'Applied', completed: true },
      { step: 'Reviewed', completed: true },
      { step: 'Interview', completed: false, current: true },
      { step: 'Decision', completed: false }
    ],
    interview: {
      date: 'Monday, Jan 13',
      time: '2:00 PM',
      interviewer: 'Sarah Chen (GM)'
    }
  }
];

export const feedPosts = [
  {
    id: 'p1',
    type: 'job',
    author: 'Urban Eats',
    authorInitials: 'UE',
    time: '2 hours ago',
    title: 'NEW OPENING',
    subtitle: 'Shift Supervisor Role',
    content: 'We\'re hiring internally! Ready for the next step in your career?',
    cta: 'Apply Now',
    likes: 24,
    comments: 8,
    featured: true
  },
  {
    id: 'p2',
    type: 'update',
    author: 'Sarah Chen',
    authorInitials: 'SC',
    authorRole: 'General Manager',
    time: '4h ago',
    content: 'Amazing shift yesterday team! We hit our daily target 2 hours early. Friday team drinks are on me! 🎉',
    likes: 42,
    comments: 15
  },
  {
    id: 'p3',
    type: 'announcement',
    title: 'New scheduling system live',
    content: 'Check your updated shifts for next week',
    time: '1 day ago'
  }
];

export const managerDashboard = {
  stats: {
    clockedIn: { current: 8, total: 12, change: 12, trend: 'up' },
    openShifts: { current: 5, period: 'this week' },
    attendance: { current: 94, change: 3, trend: 'up', period: 'this month' },
    laborCost: { current: 2400, period: 'today' }
  },
  alerts: [
    {
      id: 'alert1',
      type: 'urgent',
      title: 'Shift needs coverage',
      description: 'Thursday 6-10pm • 1 server needed',
      color: 'red'
    },
    {
      id: 'alert2',
      type: 'warning',
      title: '3 certifications expiring',
      description: 'Food safety renewals due this month',
      color: 'orange'
    },
    {
      id: 'alert3',
      type: 'opportunity',
      title: 'Marc Hunt ready for promotion',
      description: '85% match for Shift Supervisor role',
      color: 'yellow'
    }
  ],
  teamStatus: [
    { name: 'Marc Hunt', role: 'Server', clockedIn: true, time: '9:02 AM' },
    { name: 'Jessica Bano', role: 'Bartender', clockedIn: true, time: '2:15 PM' },
    { name: 'Thomas Cane', role: 'Line Cook', clockedIn: true, time: '11:30 AM' }
  ],
  aiSchedule: {
    totalCost: 4980,
    budget: 5200,
    savings: 220,
    coverage: 100,
    satisfaction: 94,
    generationTime: 2.3
  }
};

export const leaderboard = [
  { rank: 1, name: 'You!', points: 1282, change: 3, highlight: true },
  { rank: 2, name: 'Jessica Bano', points: 1104, change: -1 },
  { rank: 3, name: 'Thomas Cane', points: 987, change: 1 },
  { rank: 4, name: 'Anna Chen', points: 856, change: 0 },
  { rank: 5, name: 'Sofia Martinez', points: 723, change: -2 }
];
