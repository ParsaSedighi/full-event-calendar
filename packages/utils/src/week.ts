export function getWeekDates(date: Date, firstDay: number = 0) {
  let weekend = []
  let iniDay = new Date(date)
  iniDay.setDate(iniDay.getDate() - ((iniDay.getDay() - firstDay + 7) % 7))
  for (let i = 0; i < 7; i++) {
    weekend.push(new Date(iniDay))
    iniDay.setDate(iniDay.getDate() + 1)
  }
  return weekend
}
