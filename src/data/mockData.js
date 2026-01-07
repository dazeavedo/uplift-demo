// Complete mock data for Uplift demo - matches static HTML designs

export const users = {
  worker: {
    id: 'w1',
    name: 'Marc Hunt',
    initials: 'MH',
    role: 'Server',
    location: 'Urban Eats Downtown',
    tenure: '8 months',
    points: 1282,
    level: 'Silver',
    levelProgress: 68,
    pointsToNext: 600,
    streak: 100,
    attendance: 96,
    tasksCompleted: 247,
    email: 'marc.hunt@demo.com',
    phone: '+44 7700 900123'
  },
  manager: {
    id: 'm1',
    name: 'Sarah Chen',
    initials: 'SC',
    role: 'Shift Supervisor',
    location: 'Urban Eats Downtown',
    email: 'sarah.chen@demo.com'
  }
};

export const shifts = [
  {
    id: 's1',
    date: '2026-01-09',
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

export const teammates = [
  {
    id: 't1',
    name: 'Jessica Bano',
    initials: 'JB',
    role: 'Bartender',
    location: 'Urban Eats Downtown',
    available: true,
    qualified: true,
    distance: 'Same location',
    avatar: 'gradient-blue'
  },
  {
    id: 't2',
    name: 'Anna Martinez',
    initials: 'AM',
    role: 'Server',
    location: 'Urban Eats Westside',
    available: true,
    qualified: true,
    distance: '0.5 mi away',
    avatar: 'gradient-green'
  },
  {
    id: 't3',
    name: 'Sofia Chen',
    initials: 'SC',
    role: 'Server',
    location: 'Urban Eats Downtown',
    available: true,
    qualified: true,
    distance: 'Same location',
    avatar: 'gradient-gold'
  },
  {
    id: 't4',
    name: 'Thomas Cane',
    initials: 'TC',
    role: 'Line Cook',
    location: 'Urban Eats Downtown',
    available: false,
    qualified: true,
    distance: 'Already scheduled',
    avatar: 'gradient-blue'
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
    requirements: 5,
    metRequirements: 4,
    skills: [
      { name: 'Customer Service', status: 'complete', progress: 100 },
      { name: 'Team Leadership', status: 'inProgress', progress: 30 },
      { name: 'Conflict Resolution', status: 'needed', progress: 0 },
      { name: 'Cash Handling', status: 'complete', progress: 100 },
      { name: 'Food Safety Level 2', status: 'complete', progress: 100 }
    ],
    description: 'Lead a team of 5-8 servers, manage floor operations, handle escalations, and ensure exceptional customer experience.',
    responsibilities: [
      'Oversee daily floor operations and staff assignments',
      'Train and mentor new team members',
      'Handle customer complaints and escalations',
      'Manage cash handling and end-of-shift reporting',
      'Ensure health & safety compliance'
    ],
    posted: '3 hours ago'
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
      { step: 'Applied', completed: true, date: '5 days ago' },
      { step: 'Reviewed', completed: true, date: '3 days ago' },
      { step: 'Interview', completed: false, current: true, date: 'Monday, Jan 13 at 2:00 PM' },
      { step: 'Decision', completed: false }
    ],
    interview: {
      date: 'Monday, Jan 13',
      time: '2:00 PM',
      interviewer: 'Sarah Chen',
      interviewerRole: 'General Manager',
      location: 'Urban Eats Downtown - Office',
      duration: '30 minutes',
      type: 'In-person'
    }
  }
];

export const feedPosts = [
  {
    id: 'p1',
    type: 'announcement',
    author: 'Management',
    authorInitials: 'UE',
    authorRole: 'Urban Eats',
    avatar: 'gradient-gold',
    time: '1 hour ago',
    badge: { text: 'Important', color: 'red' },
    content: 'Team meeting tomorrow at 3 PM. Pizza will be provided! We\'ll be discussing Q1 goals and celebrating this month\'s top performers.',
    likes: 23,
    comments: 8,
    shares: 2,
    liked: false
  },
  {
    id: 'p2',
    type: 'job',
    author: 'Hiring Team',
    authorInitials: 'HT',
    authorRole: 'Uplift',
    avatar: 'gradient-blue',
    time: '3 hours ago',
    badge: { text: 'New Role', color: 'blue' },
    content: 'New opportunity that matches your skills!',
    jobCard: {
      title: 'Shift Supervisor',
      location: 'Urban Eats Downtown',
      salary: '£38,480/year',
      match: 85,
      requirements: '4/5 requirements'
    },
    likes: 5,
    comments: 2,
    liked: false
  },
  {
    id: 'p3',
    type: 'recognition',
    author: 'Sarah Chen',
    authorInitials: 'SC',
    authorRole: 'Shift Supervisor',
    avatar: 'gradient-green',
    time: '5 hours ago',
    badge: { text: 'Recognition', color: 'gold' },
    content: 'Huge shoutout to Marc Hunt for covering my Saturday shift last minute! You\'re a lifesaver! 🙏',
    likes: 42,
    comments: 12,
    liked: true
  },
  {
    id: 'p4',
    type: 'task',
    author: 'Jessica Bano',
    authorInitials: 'JB',
    authorRole: 'Bartender',
    avatar: 'gradient-blue',
    time: '6 hours ago',
    badge: { text: 'Completed', color: 'green' },
    content: 'Morning safety inspection complete! All equipment checked and ready to go ✓',
    hasImage: true,
    likes: 18,
    comments: 3
  },
  {
    id: 'p5',
    type: 'milestone',
    author: 'Uplift',
    authorInitials: 'UP',
    authorRole: 'Platform',
    avatar: 'gradient-gold',
    time: 'Yesterday',
    badge: { text: 'Milestone', color: 'gold' },
    content: 'Marc Hunt just hit a 100-day attendance streak! 🎉 Consistency pays off - Marc earned 500 bonus points!',
    likes: 156,
    comments: 24,
    liked: true
  }
];

export const tasks = [
  {
    id: 'task1',
    title: 'Complete Food Safety Training',
    description: 'Annual food safety certification renewal',
    dueDate: '2026-01-15',
    status: 'pending',
    priority: 'high',
    points: 100,
    category: 'Training'
  },
  {
    id: 'task2',
    title: 'Pre-Shift Equipment Check',
    description: 'Check all equipment before shift starts',
    dueDate: 'Today',
    status: 'completed',
    priority: 'medium',
    points: 25,
    category: 'Daily'
  },
  {
    id: 'task3',
    title: 'Team Feedback Survey',
    description: 'Share your thoughts on this month',
    dueDate: '2026-01-20',
    status: 'pending',
    priority: 'low',
    points: 50,
    category: 'Feedback'
  }
];

export const notifications = [
  {
    id: 'n1',
    type: 'shift',
    title: 'Shift reminder',
    message: 'Your shift starts in 2 hours',
    time: '10 mins ago',
    read: false,
    actionable: true
  },
  {
    id: 'n2',
    type: 'job',
    title: 'Interview scheduled',
    message: 'Your interview for Shift Supervisor is confirmed',
    time: '3 hours ago',
    read: false
  },
  {
    id: 'n3',
    type: 'social',
    title: 'Sarah Chen mentioned you',
    message: 'Huge shoutout to Marc Hunt for covering...',
    time: '5 hours ago',
    read: true
  }
];

export const managerDashboard = {
  stats: {
    clockedIn: { current: 8, total: 12, change: 12, trend: 'up' },
    openShifts: { current: 5, period: 'this week' },
    attendance: { current: 94, change: 3, trend: 'up', period: 'this month' },
    laborCost: { current: 2400, budget: 2800, period: 'today' }
  },
  alerts: [
    {
      id: 'alert1',
      type: 'urgent',
      title: 'Shift needs coverage',
      description: 'Thursday 6-10pm • 1 server needed',
      priority: 'high',
      color: 'red'
    },
    {
      id: 'alert2',
      type: 'warning',
      title: '3 certifications expiring',
      description: 'Food safety renewals due this month',
      priority: 'medium',
      color: 'orange'
    },
    {
      id: 'alert3',
      type: 'opportunity',
      title: 'Marc Hunt ready for promotion',
      description: '85% match for Shift Supervisor role',
      priority: 'low',
      color: 'yellow'
    }
  ],
  teamStatus: [
    { name: 'Marc Hunt', role: 'Server', clockedIn: true, time: '9:02 AM', initials: 'MH' },
    { name: 'Jessica Bano', role: 'Bartender', clockedIn: true, time: '2:15 PM', initials: 'JB' },
    { name: 'Thomas Cane', role: 'Line Cook', clockedIn: true, time: '11:30 AM', initials: 'TC' }
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
  { rank: 1, name: 'You!', points: 1282, change: 3, highlight: true, avatar: 'MH' },
  { rank: 2, name: 'Jessica Bano', points: 1104, change: -1, avatar: 'JB' },
  { rank: 3, name: 'Thomas Cane', points: 987, change: 1, avatar: 'TC' },
  { rank: 4, name: 'Anna Chen', points: 856, change: 0, avatar: 'AC' },
  { rank: 5, name: 'Sofia Martinez', points: 723, change: -2, avatar: 'SM' }
];
