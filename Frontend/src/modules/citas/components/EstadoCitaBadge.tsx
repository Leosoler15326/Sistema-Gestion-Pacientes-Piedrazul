import type { EstadoCita } from '../types/cita.types';

interface EstadoCitaBadgeProps {
  estado: EstadoCita;
}

const stylesByEstado: Record<EstadoCita, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  CONFIRMADA: 'bg-blue-100 text-blue-800',
  CANCELADA: 'bg-red-100 text-red-800',
  COMPLETADA: 'bg-green-100 text-green-800',
  REAGENDADA: 'bg-purple-100 text-purple-800',
};

export default function EstadoCitaBadge({ estado }: EstadoCitaBadgeProps) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stylesByEstado[estado]}`}>
      {estado}
    </span>
  );
}