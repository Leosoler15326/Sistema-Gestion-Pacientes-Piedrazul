
import type { AntecedentesDto } from '../types/historiaClinica.types';

interface AntecedentesSectionProps {
  value: AntecedentesDto;
  onChange: (value: AntecedentesDto) => void;
}

export default function AntecedentesSection({
  value,
  onChange,
}: AntecedentesSectionProps) {
  const handleFieldChange = (field: keyof AntecedentesDto, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <textarea
        rows={3}
        placeholder="Antecedentes personales"
        value={value.personales ?? ''}
        onChange={(e) => handleFieldChange('personales', e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
      />

      <textarea
        rows={3}
        placeholder="Antecedentes familiares"
        value={value.familiares ?? ''}
        onChange={(e) => handleFieldChange('familiares', e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
      />

      <textarea
        rows={3}
        placeholder="Alergias"
        value={value.alergias ?? ''}
        onChange={(e) => handleFieldChange('alergias', e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
      />

      <textarea
        rows={3}
        placeholder="Medicamentos"
        value={value.medicamentos ?? ''}
        onChange={(e) => handleFieldChange('medicamentos', e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
      />
    </div>
  );
}