import { DayPicker } from 'react-day-picker';
import { es } from 'react-day-picker/locale';
import { getFestivosColombia } from '../../utils/colombianHolidays';

interface FestivosDatePickerProps {
  value: string;        // YYYY-MM-DD  (vacío = sin selección)
  onChange: (date: string) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function dateToIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function buildFestivoDates(): Date[] {
  const year = new Date().getFullYear();
  const result: Date[] = [];
  for (const iso of getFestivosColombia(year)) result.push(isoToDate(iso));
  for (const iso of getFestivosColombia(year + 1)) result.push(isoToDate(iso));
  return result;
}

// Pre-calculado una sola vez al cargar el módulo
const FESTIVO_DATES = buildFestivoDates();

// Clases de Tailwind para cada parte del calendario (sin CSS externo)
const calendarClassNames = {
  root: 'p-3',
  months: 'relative',
  month: 'space-y-4',
  month_caption: 'flex justify-center items-center h-7',
  caption_label: 'text-sm font-semibold text-slate-800',
  nav: 'absolute inset-x-0 top-0 flex justify-between',
  button_previous:
    'inline-flex items-center justify-center h-7 w-7 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
  button_next:
    'inline-flex items-center justify-center h-7 w-7 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
  month_grid: 'w-full border-collapse',
  weekdays: 'flex',
  weekday: 'text-slate-500 text-xs font-medium w-9 text-center pb-1',
  week: 'flex w-full mt-1',
  day: 'relative p-0 text-center',
  day_button:
    'inline-flex items-center justify-center w-9 h-9 rounded-full text-sm transition-colors ' +
    'hover:bg-blue-50 hover:text-blue-700 ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-300',
  selected:
    'bg-blue-600 text-white rounded-full hover:bg-blue-600 hover:text-white focus:bg-blue-600',
  today: 'font-bold text-blue-600',
  outside: 'text-slate-300',
  disabled: 'text-slate-300 cursor-not-allowed opacity-50 hover:bg-transparent hover:text-slate-300',
  hidden: 'invisible',
};

export default function FestivosDatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  className,
}: FestivosDatePickerProps) {
  const selected = value ? isoToDate(value) : undefined;

  const disabled = [
    { dayOfWeek: [0] as number[] },
    ...FESTIVO_DATES,
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ];

  const handleSelect = (date: Date | undefined) => {
    if (date) onChange(dateToIso(date));
  };

  return (
    <div
      className={`inline-block rounded-xl border border-slate-200 bg-white shadow-sm ${className ?? ''}`}
    >
      <DayPicker
        mode="single"
        locale={es}
        selected={selected}
        onSelect={handleSelect}
        disabled={disabled}
        modifiers={{ festivo: FESTIVO_DATES }}
        modifiersClassNames={{
          festivo: '!bg-red-100 !text-red-800 !font-semibold cursor-not-allowed',
        }}
        classNames={calendarClassNames}
        startMonth={minDate}
        endMonth={maxDate}
      />
      <div className="flex items-center gap-4 border-t border-slate-100 px-4 py-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-200 border border-red-300" />
          Festivo (no disponible)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-blue-600" />
          Seleccionado
        </span>
      </div>
    </div>
  );
}
