function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// Per Ley 51/1983 (Ley Emiliani): mobile holidays move to the following Monday
function siguienteLunes(date: Date): Date {
  const d = new Date(date);
  const dow = d.getDay();
  if (dow === 1) return d;
  d.setDate(d.getDate() + (dow === 0 ? 1 : 8 - dow));
  return d;
}

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getFestivosColombia(year: number): Set<string> {
  const easter = easterSunday(year);
  const festivos = new Set<string>();

  // Fixed holidays
  festivos.add(`${year}-01-01`); // Año Nuevo
  festivos.add(`${year}-05-01`); // Día del Trabajo
  festivos.add(`${year}-07-20`); // Independencia
  festivos.add(`${year}-08-07`); // Batalla de Boyacá
  festivos.add(`${year}-12-08`); // Inmaculada Concepción
  festivos.add(`${year}-12-25`); // Navidad

  // Holy Week (fixed, not moved)
  festivos.add(toISO(addDays(easter, -3))); // Jueves Santo
  festivos.add(toISO(addDays(easter, -2))); // Viernes Santo

  // Mobile holidays (moved to next Monday per Ley Emiliani)
  festivos.add(toISO(siguienteLunes(new Date(year, 0, 6))));   // Reyes Magos
  festivos.add(toISO(siguienteLunes(new Date(year, 2, 19))));  // San José
  festivos.add(toISO(siguienteLunes(addDays(easter, 39))));    // Ascensión
  festivos.add(toISO(siguienteLunes(addDays(easter, 60))));    // Corpus Christi
  festivos.add(toISO(siguienteLunes(addDays(easter, 68))));    // Sagrado Corazón
  festivos.add(toISO(siguienteLunes(new Date(year, 5, 29))));  // San Pedro y San Pablo
  festivos.add(toISO(siguienteLunes(new Date(year, 7, 15)))); // Asunción de la Virgen
  festivos.add(toISO(siguienteLunes(new Date(year, 9, 12)))); // Día de la Raza
  festivos.add(toISO(siguienteLunes(new Date(year, 10, 1)))); // Todos los Santos
  festivos.add(toISO(siguienteLunes(new Date(year, 10, 11)))); // Independencia de Cartagena

  return festivos;
}

export function esFestivoColombia(dateString: string): boolean {
  const year = parseInt(dateString.substring(0, 4), 10);
  return getFestivosColombia(year).has(dateString);
}
