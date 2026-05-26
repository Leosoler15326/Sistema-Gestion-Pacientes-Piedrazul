import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import InlineMessage from '../../../components/common/InlineMessage';
import Loader from '../../../components/common/Loader';
import BackButton from '../../../components/common/BackButton';
import { APP_ROUTES } from '../../../app/router/routes';
import { ESPECIALIDAD_OPTIONS, TIPO_PROFESIONAL_OPTIONS } from '../../../constants/enums';
import { useProfesionalDetail, useUpdateProfesional } from '../hooks/useprofesionales';
import type { ActualizarProfesionalDto } from '../types/profesional.types';

export default function ProfesionalEditPage() {
  const { id } = useParams();
  const profesionalId = Number(id);
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProfesionalDetail(profesionalId);
  const updateMutation = useUpdateProfesional();

  const [nombres, setNombres] = useState('');
  const [tipo, setTipo] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [intervaloMinutos, setIntervaloMinutos] = useState('');
  const [habilidadesAdicionales, setHabilidadesAdicionales] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (data && !initialized) {
    setNombres(data.nombres ?? '');
    setTipo(data.tipo ?? '');
    setEspecialidad(data.especialidad ?? '');
    setIntervaloMinutos(String(data.intervaloMinutos ?? 30));
    setHabilidadesAdicionales(data.habilidadesAdicionales ?? '');
    setInitialized(true);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const intervalo = Number(intervaloMinutos);
    if (!nombres.trim()) { setErrorMessage('El nombre es obligatorio.'); return; }
    if (!tipo) { setErrorMessage('Selecciona el tipo de profesional.'); return; }
    if (!especialidad) { setErrorMessage('Selecciona la especialidad.'); return; }
    if (!intervalo || intervalo <= 0) { setErrorMessage('El intervalo debe ser mayor a 0.'); return; }

    const payload: ActualizarProfesionalDto = {
      nombres: nombres.trim(),
      tipo,
      especialidad,
      intervaloMinutos: intervalo,
      habilidadesAdicionales: habilidadesAdicionales.trim() || null,
    };

    try {
      await updateMutation.mutateAsync({ id: profesionalId, payload });
      navigate(APP_ROUTES.PROFESIONALES_DETALLE.replace(':id', String(profesionalId)));
    } catch {
      setErrorMessage('No fue posible guardar los cambios. Intenta de nuevo.');
    }
  };

  if (isLoading) return <Loader message="Cargando datos del profesional..." />;
  if (isError || !data) return (
    <div className="min-h-screen bg-gray-100 p-6">
      <InlineMessage type="error" message="No se pudo cargar el profesional." />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <PageHeader
        title="Editar profesional"
        subtitle={`Modificando datos de ${data.nombres}`}
        actions={<BackButton />}
      />

      {errorMessage && (
        <div className="mb-4 max-w-xl">
          <InlineMessage type="error" message={errorMessage} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-xl space-y-4 rounded-2xl bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Nombres <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tipo de profesional <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Selecciona tipo</option>
            {TIPO_PROFESIONAL_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Especialidad <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Selecciona especialidad</option>
            {ESPECIALIDAD_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Intervalo de agenda (minutos) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={5}
            max={120}
            required
            value={intervaloMinutos}
            onChange={(e) => setIntervaloMinutos(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Habilidades adicionales <span className="text-slate-400 text-xs">(opcional)</span>
          </label>
          <input
            value={habilidadesAdicionales}
            onChange={(e) => setHabilidadesAdicionales(e.target.value)}
            placeholder="Ej: Pediatría, manejo de pacientes adultos mayores"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <p className="text-xs text-slate-400">
          Los campos con <span className="text-red-500">*</span> son obligatorios.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            onClick={() => navigate(APP_ROUTES.PROFESIONALES_DETALLE.replace(':id', String(profesionalId)))}
            className="rounded-lg border border-slate-300 px-4 py-3 text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
