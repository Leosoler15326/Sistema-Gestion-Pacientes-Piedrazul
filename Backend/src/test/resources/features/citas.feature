# language: es
Característica: Agendamiento y gestión de citas
  Como agendador
  Quiero poder agendar, consultar y cancelar citas
  Para organizar la atención a los pacientes

  Escenario: Consultar slots disponibles de un profesional con franja activa
    Dado que existe un profesional con franja de 08:00 a 10:00 e intervalo de 30 minutos
    Cuando consulto los slots disponibles del profesional para mañana
    Entonces el sistema responde con código 200
    Y la respuesta contiene 4 slots disponibles

  Escenario: Agendar una cita en un slot disponible
    Dado que existe un profesional con franja de 08:00 a 10:00 e intervalo de 30 minutos
    Y existe un paciente de citas con documento "ACC_CITA_001"
    Cuando agendo una cita para mañana a las "08:00"
    Entonces el sistema responde con código 201
    Y la cita queda en estado "PROGRAMADA"

  Escenario: No se puede agendar dos citas en el mismo horario
    Dado que existe un profesional con franja de 08:00 a 10:00 e intervalo de 30 minutos
    Y existe un paciente de citas con documento "ACC_CITA_002"
    Y ya existe una cita agendada para mañana a las "08:00"
    Cuando agendo una cita para mañana a las "08:00"
    Entonces el sistema responde con código 409

  Escenario: Cancelar una cita programada
    Dado que existe un profesional con franja de 08:00 a 10:00 e intervalo de 30 minutos
    Y existe un paciente de citas con documento "ACC_CITA_003"
    Y hay una cita programada para mañana a las "09:00"
    Cuando cancelo la cita con motivo "El paciente no puede asistir"
    Entonces el sistema responde con código 204
