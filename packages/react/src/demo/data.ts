// Sample data for the React demo. Events are generated relative to today
// so the calendar always has content around the initial date.

export interface DemoEvent {
  id: number
  name: string
  start: Date
  end: Date
  color?: string
  groups?: number[]
}

export const demoGroups = [
  { id: 1, name: 'Amir' },
  { id: 2, name: 'Sara' },
  { id: 3, name: 'Meeting room A' }
]

const COLORS = ['#BF51F9', '#31B5F7', '#F7A131', '#31F763', '#F73131', '#8E31F7', '#31F7D5', '#F7319E', '#FF8631']

let uid = 1000

function at(dayOffset: number, hour: number, minute = 0): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + dayOffset)
  d.setHours(hour, minute, 0, 0)
  return d
}

function ev(
  dayOffset: number,
  startHour: number,
  endHour: number,
  name: string,
  group?: number,
  minute = 0
): DemoEvent {
  return {
    id: uid++,
    name,
    start: at(dayOffset, startHour, minute),
    end: at(dayOffset, endHour, minute + 30),
    color: COLORS[uid % COLORS.length],
    ...(group ? { groups: [group] } : {})
  }
}

export function makeEvents(): DemoEvent[] {
  const list: DemoEvent[] = []

  // morning standups across several days (group: team)
  for (let d = -2; d <= 9; d++) {
    if ((d + 3) % 3 === 2) continue // skip some days
    list.push(ev(d, 9, 10, 'Team standup', 3, 30))
  }

  // timed events today & nearby days
  list.push(ev(0, 10, 11, 'Design review', 2))
  list.push(ev(0, 12, 13, 'Lunch with the team', 1, 30))
  list.push(ev(0, 14, 16, 'Deep work: refactoring'))
  list.push(ev(0, 17, 18, '1:1 with Sara', 2, 30))
  list.push(ev(1, 9, 11, 'Sprint planning', 3))
  list.push(ev(1, 13, 15, 'Customer call'))
  list.push(ev(1, 19, 21, 'Gym'))
  list.push(ev(2, 8, 10, 'Workshop', 3))
  list.push(ev(2, 11, 12, 'Retro', 3, 15))
  list.push(ev(2, 16, 17, 'Dentist'))
  list.push(ev(3, 10, 12, 'Interview: frontend dev', 1))
  list.push(ev(3, 15, 18, 'Release party'))
  list.push(ev(4, 9, 10, 'Weekly recap', 3))
  list.push(ev(4, 14, 15, 'Marketing sync'))
  list.push(ev(5, 11, 13, 'Hackathon kickoff', 3))
  list.push(ev(6, 10, 12, 'Family brunch'))
  list.push(ev(7, 13, 16, 'Conference talk prep'))
  list.push(ev(-1, 15, 17, 'Roadmap review', 3))
  list.push(ev(-2, 9, 10, 'Bug triage', 3))

  // multi day (>= 24h => rendered in the all-day rows)
  list.push({
    id: uid++,
    name: 'Company offsite',
    start: at(1, 0),
    end: at(3, 23, 59),
    color: '#BF51F9',
    groups: [3]
  })
  list.push({
    id: uid++,
    name: 'Amir on vacation',
    start: at(5, 0),
    end: at(8, 23, 59),
    color: '#F7A131',
    groups: [1]
  })
  list.push({
    id: uid++,
    name: 'Beta launch week',
    start: at(2, 0),
    end: at(4, 23, 59),
    color: '#31F763'
  })

  return list
}

export function makeRandomEvent(): DemoEvent {
  const dayOffset = Math.floor(Math.random() * 10) - 3
  const hour = 8 + Math.floor(Math.random() * 10)
  const names = ['Sync', 'Focus block', 'Coffee chat', 'Planning', 'Follow-up', 'Demo', 'Walk & talk', 'Review session']
  return {
    id: uid++,
    name: names[Math.floor(Math.random() * names.length)],
    start: at(dayOffset, hour),
    end: at(dayOffset, hour + 1),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    groups: [1 + Math.floor(Math.random() * 3)]
  }
}

export function startOfToday(): Date {
  const d = new Date()
  d.setHours(8, 0, 0, 0)
  return d
}
