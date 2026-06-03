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

export interface FestivoInfo {
  fecha: string;
  nombre: string;
}

function getFestivosConNombre(year: number): FestivoInfo[] {
  const easter = easterSunday(year);
  return [
    { fecha: `${year}-01-01`, nombre: 'Año Nuevo' },
    { fecha: toISO(siguienteLunes(new Date(year, 0, 6))), nombre: 'Reyes Magos' },
    { fecha: toISO(siguienteLunes(new Date(year, 2, 19))), nombre: 'San José' },
    { fecha: toISO(addDays(easter, -3)), nombre: 'Jueves Santo' },
    { fecha: toISO(addDays(easter, -2)), nombre: 'Viernes Santo' },
    { fecha: `${year}-05-01`, nombre: 'Día del Trabajo' },
    { fecha: toISO(siguienteLunes(addDays(easter, 39))), nombre: 'Ascensión' },
    { fecha: toISO(siguienteLunes(addDays(easter, 60))), nombre: 'Corpus Christi' },
    { fecha: toISO(siguienteLunes(addDays(easter, 68))), nombre: 'Sagrado Corazón' },
    { fecha: toISO(siguienteLunes(new Date(year, 5, 29))), nombre: 'San Pedro y San Pablo' },
    { fecha: `${year}-07-20`, nombre: 'Independencia de Colombia' },
    { fecha: `${year}-08-07`, nombre: 'Batalla de Boyacá' },
    { fecha: toISO(siguienteLunes(new Date(year, 7, 15))), nombre: 'Asunción de la Virgen' },
    { fecha: toISO(siguienteLunes(new Date(year, 9, 12))), nombre: 'Día de la Raza' },
    { fecha: toISO(siguienteLunes(new Date(year, 10, 1))), nombre: 'Todos los Santos' },
    { fecha: toISO(siguienteLunes(new Date(year, 10, 11))), nombre: 'Independencia de Cartagena' },
    { fecha: `${year}-12-08`, nombre: 'Inmaculada Concepción' },
    { fecha: `${year}-12-25`, nombre: 'Navidad' },
  ];
}

export function getFestivosColombia(year: number): Set<string> {
  return new Set(getFestivosConNombre(year).map((f) => f.fecha));
}

export function esFestivoColombia(dateString: string): boolean {
  const year = parseInt(dateString.substring(0, 4), 10);
  return getFestivosColombia(year).has(dateString);
}

/** Returns all Colombian holidays between `desde` and `hasta` (YYYY-MM-DD), inclusive. */
export function getProximosFestivos(desde: string, hasta: string): FestivoInfo[] {
  const fromYear = parseInt(desde.substring(0, 4), 10);
  const toYear = parseInt(hasta.substring(0, 4), 10);

  const todos: FestivoInfo[] = [];
  for (let y = fromYear; y <= toYear; y++) {
    todos.push(...getFestivosConNombre(y));
  }

  return todos
    .filter((f) => f.fecha >= desde && f.fecha <= hasta)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}
