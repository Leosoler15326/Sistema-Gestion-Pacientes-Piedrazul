# language: es
Característica: Gestión de pacientes
  Como agendador
  Quiero registrar y consultar pacientes en el sistema
  Para poder agendar sus citas médicas

  Escenario: Registrar un nuevo paciente con datos válidos
    Cuando registro el paciente con documento "ACC_PAC_001" nombres "Rosa" apellidos "Muñoz" teléfono "3101234567"
    Entonces el sistema responde con código 201
    Y el cuerpo contiene el documento "ACC_PAC_001"

  Escenario: No se puede registrar dos pacientes con el mismo documento
    Dado que existe un paciente con documento "ACC_PAC_002"
    Cuando registro el paciente con documento "ACC_PAC_002" nombres "Otro" apellidos "Paciente" teléfono "3009999999"
    Entonces el sistema responde con código 400

  Escenario: Buscar paciente por documento existente devuelve sus datos
    Dado que existe un paciente con documento "ACC_PAC_003"
    Cuando busco el paciente por documento "ACC_PAC_003"
    Entonces el sistema responde con código 200
    Y el cuerpo contiene el documento "ACC_PAC_003"

  Escenario: Buscar paciente por documento inexistente devuelve 404
    Cuando busco el paciente por documento "DOC_INEXISTENTE_ACC_XYZ"
    Entonces el sistema responde con código 404
