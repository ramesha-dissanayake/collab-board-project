export const defaultProfile = {
  name: 'Maya Fernando',
  userId: 'CB-1042',
  age: '21',
  description: 'Front-end developer who enjoys turning team ideas into simple, useful products.',
  photo: '',
};

export const projectsData = [
  {
    id: 'project-1',
    name: 'CollabBoard launch',
    description: 'Build and launch the collaborative task board for the full-stack module.',
    status: 'Ongoing',
    startedMonth: 'August',
    progress: 64,
    members: ['MF', 'JK', 'AS'],
  },
  {
    id: 'project-2',
    name: 'Portfolio refresh',
    description: 'Improve the case-study pages and make the site responsive.',
    status: 'Ongoing',
    startedMonth: 'July',
    progress: 38,
    members: ['MF', 'RN'],
  },
  {
    id: 'project-3',
    name: 'Campus event planner',
    description: 'A lightweight planner for student society events and volunteers.',
    status: 'Completed',
    startedMonth: 'June',
    progress: 100,
    members: ['MF', 'LD', 'NO'],
  },
  {
    id: 'project-4',
    name: 'Research dashboard',
    description: 'Visualise survey responses and research milestones in one place.',
    status: 'Completed',
    startedMonth: 'May',
    progress: 100,
    members: ['MF', 'PT'],
  },
];

export const contactDirectory = [
  { id: 'CB-1008', name: 'Aisha Silva', initials: 'AS', role: 'UI Designer', frequent: true },
  { id: 'CB-1017', name: 'Jordan Kim', initials: 'JK', role: 'Developer', frequent: true },
  { id: 'CB-1024', name: 'Noah Perera', initials: 'NP', role: 'Project Lead', frequent: false },
  { id: 'CB-1048', name: 'Riya Nair', initials: 'RN', role: 'Researcher', frequent: true },
  { id: 'CB-1142', name: 'Lena Dias', initials: 'LD', role: 'Developer', frequent: false },
  { id: 'CB-1402', name: 'Owen Tan', initials: 'OT', role: 'QA Tester', frequent: false },
  { id: 'CB-1420', name: 'Priya Thomas', initials: 'PT', role: 'Product Designer', frequent: false },
];

export const initialContacts = contactDirectory.slice(0, 5);

export const initialSentRequests = [
  contactDirectory[5],
  contactDirectory[6],
];

export const initialRecentFriends = [
  { ...contactDirectory[3], added: 'Today' },
  { ...contactDirectory[4], added: 'Yesterday' },
];

export const initialReceivedRequests = [
  { id: 'CB-1061', name: 'Sam Wijesinghe', initials: 'SW', role: 'Back-end Developer' },
  { id: 'CB-1073', name: 'Amara Jay', initials: 'AJ', role: 'Business Analyst' },
];
