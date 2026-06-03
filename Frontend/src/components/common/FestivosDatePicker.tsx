import { DayPicker } from 'react-day-picker';
import { es } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
import { getFestivosColombia } from '../../utils/colombianHolidays';

interface FestivosDatePickerProps {
  value: string;           // YYYY-MM-DD, vacío si no hay selección
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
  const dates: Date[] = [];
  for (const iso of [...getFestivosColombia(year), ...getFestivosColombia(year + 1)]) {
    dates.push(isoToDate(iso));
  }
  return dates;
}

const festivoDates = buildFestivoDates();

export default function FestivosDatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  className,
}: FestivosDatePickerProps) {
  const selected = value ? isoToDate(value) : undefined;

  const disabled: Parameters<typeof DayPicker>[0]['disabled'] = [
    { dayOfWeek: [0] },     // domingos
    ...festivoDates,        // festivos colombianos
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ];

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    onChange(dateToIso(date));
  };

  return (
    <div className={`inline-block rounded-xl border border-slate-200 bg-white p-2 shadow-sm ${className ?? ''}`}>
      <DayPicker
        mode="single"
        locale={es}
        selected={selected}
        onSelect={handleSelect}
        disabled={disabled}
        modifiers={{ festivo: festivoDates }}
        modifiersStyles={{
          festivo: {
            color: '#991b1b',
            backgroundColor: '#fee2e2',
            fontWeight: '600',
          },
        }}
        startMonth={minDate}
        endMonth={maxDate}
        style={{ '--rdp-accent-color': '#2563eb' } as React.CSSProperties}
      />
      <p className="mt-1 px-1 text-xs text-slate-400">
        <span className="mr-3 inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-red-200" /> Festivo
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full bg-blue-600" /> Seleccionado
        </span>
      </p>
    </div>
  );
}
