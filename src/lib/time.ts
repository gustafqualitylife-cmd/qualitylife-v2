export function utcToLocalLabel(dUtc: Date): string {
  const local = new Date(dUtc.getTime());
  return local.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function startOfWeekMonday(d: Date) {
  const day = (d.getDay() + 6) % 7; // 0 = Mån
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  monday.setHours(0, 0, 0, 0);
  return monday;
}
