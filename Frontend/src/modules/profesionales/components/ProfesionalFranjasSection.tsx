import { useEffect, useState } from 'react';
import InlineMessage from '../../../components/common/InlineMessage';
import Loader from '../../../components/common/Loader';
import {
  useActualizarFranjasProfesional,
  useFranjasProfesional,
} from '../hooks/useprofesionales';
import type { FranjaHorariaDto } from '../types/profesional.types';

const DIAS_SEMANA: { value: string; label: string }[] = [
  { value: 'MONDAY', label: 'Lunes' },
  { value: 'TUESDAY', label: 'Martes' },
  { value: 'WEDNESDAY', label: 'Miércoles' },
  { value: 'THURSDAY', label: 'Jueves' },
  { value: 'FRIDAY', label: 'Viernes' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' },
];

function horaParaInput(iso: string | undefined): string {
  if (!iso) return '';
  const part = iso.includes('T') ? iso.split('T')[1] : iso;
  return part.slice(0, 5);
}

function horaParaApi(hhmm: string): string {
  if (!hhmm) return '09:00:00';
  return hhmm.length === 5 ? `${hhmm}:00` : hhmm;
}

type Fila = { key: string; diaSemana: string; horaInicio: string; horaFin: string };

let keySeq = 0;
function nuevaFila(): Fila {
  keySeq += 1;
  return {
    key: `n-${keySeq}`,
    diaSemana: 'MONDAY',
    horaInicio: '09:00',
    horaFin: '17:00',
  };
}

function desdeApi(franjas: FranjaHorariaDto[]): Fila[] {
  return franjas.map((f, i) => ({
    key: f.id != null ? `id-${f.id}` : `i-${i}`,
    diaSemana: f.diaSemana ?? 'MONDAY',
    horaInicio: horaParaInput(f.horaInicio),
    horaFin: horaParaInput(f.horaFin),
  }));
}

interface ProfesionalFranjasSectionProps {
  profesionalId: number;
  intervaloMinutos: number;
  puedeEditar: boolean;
}

export default function ProfesionalFranjasSection({
  profesionalId,
  intervaloMinutos,
  puedeEditar,
}: ProfesionalFranjasSectionProps) {
  const { data, isLoading, isError } = useFranjasProfesional(profesionalId);
  const guardarMutation = useActualizarFranjasProfesional();
  const [filas, setFilas] = useState<Fila[]>([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setFilas(data.length ? desdeApi(data) : []);
    }
  }, [data]);

  const handleAgregar = () => {
    setFilas((prev) => [...prev, nuevaFila()]);
  };

  const handleQuitar = (key: string) => {
    setFilas((prev) => prev.filter((f) => f.key !== key));
  };

  const handleCambiar = (
    key: string,
    campo: keyof Pick<Fila, 'diaSemana' | 'horaInicio' | 'horaFin'>,
    valor: string
  ) => {
    setFilas((prev) =>
      prev.map((f) => (f.key === key ? { ...f, [campo]: valor } : f))
    );
  };

  const handleGuardar = async () => {
    setMensaje('');
    for (const f of filas) {
      if (f.horaInicio >= f.horaFin) {
        setMensaje('Cada franja debe tener hora de inicio menor que hora de fin.');
        return;
      }
    }
    const payload: FranjaHorariaDto[] = filas.map((f) => ({
      diaSemana: f.diaSemana,
      horaInicio: horaParaApi(f.horaInicio),
      horaFin: horaParaApi(f.horaFin),
    }));
    try {
      await guardarMutation.mutateAsync({ id: profesionalId, franjas: payload });
      setMensaje('Franjas guardadas correctamente.');
    } catch {
      setMensaje('No fue posible guardar las franjas.');
    }
  };

  if (isLoading) {
    return <Loader message="Cargando franjas horarias..." />;
  }

  if (isError) {
    return (
      <InlineMessage
        type="error"
        message="No fue posible cargar las franjas. ¿Tienes permisos para ver este profesional?"
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Franjas horarias</h3>
          <p className="text-xs text-slate-500">
            Días y rangos en los que el profesional atiende. Los turnos se generan cada{' '}
            <strong>{intervaloMinutos} min</strong> dentro de cada franja.
          </p>
        </div>
        {puedeEditar && (
          <button
            type="button"
            onClick={handleAgregar}
            className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-sm text-blue-700"
          >
            Añadir franja
          </button>
        )}
      </div>

      {mensaje && (
        <div className="mb-3">
          <InlineMessage
            type={mensaje.includes('correctamente') ? 'success' : 'error'}
            message={mensaje}
          />
        </div>
      )}

      {filas.length === 0 ? (
        <p className="text-sm text-slate-600">
          {puedeEditar
            ? 'No hay franjas definidas. Añade al menos una para que aparezcan horarios al agendar citas.'
            : 'Sin franjas registradas para este profesional.'}
        </p>
      ) : (
        <div className="space-y-2">
          {filas.map((f) => (
            <div
              key={f.key}
              className="flex flex-wrap items-end gap-2 rounded-lg border border-slate-200 bg-white p-3"
            >
              <div className="min-w-[140px] flex-1">
                <label className="mb-1 block text-xs text-slate-500">Día</label>
                <select
                  value={f.diaSemana}
                  disabled={!puedeEditar}
                  onChange={(e) => handleCambiar(f.key, 'diaSemana', e.target.value)}
                  className="w-full rounded-lg border px-2 py-2 text-sm disabled:bg-slate-100"
                >
                  {DIAS_SEMANA.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-32">
                <label className="mb-1 block text-xs text-slate-500">Desde</label>
                <input
                  type="time"
                  value={f.horaInicio}
                  disabled={!puedeEditar}
                  onChange={(e) => handleCambiar(f.key, 'horaInicio', e.target.value)}
                  className="w-full rounded-lg border px-2 py-2 text-sm disabled:bg-slate-100"
                />
              </div>
              <div className="w-32">
                <label className="mb-1 block text-xs text-slate-500">Hasta</label>
                <input
                  type="time"
                  value={f.horaFin}
                  disabled={!puedeEditar}
                  onChange={(e) => handleCambiar(f.key, 'horaFin', e.target.value)}
                  className="w-full rounded-lg border px-2 py-2 text-sm disabled:bg-slate-100"
                />
              </div>
              {puedeEditar && (
                <button
                  type="button"
                  onClick={() => handleQuitar(f.key)}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700"
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {puedeEditar && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleGuardar}
            disabled={guardarMutation.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {guardarMutation.isPending ? 'Guardando...' : 'Guardar franjas'}
          </button>
        </div>
      )}

      {!puedeEditar && (
        <p className="mt-3 text-xs text-slate-500">
          Solo un administrador puede modificar las franjas. Si falta disponibilidad al agendar,
          pide a un administrador que configure este horario.
        </p>
      )}
    </div>
  );
}
