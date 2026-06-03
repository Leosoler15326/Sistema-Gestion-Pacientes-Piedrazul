# language: es
Característica: Autenticación de usuarios del sistema
  Como administrador del sistema
  Quiero gestionar el acceso de los usuarios
  Para que solo personal autorizado pueda operar el sistema

  Escenario: Registro exitoso de un nuevo agendador
    Cuando registro el usuario "acc_auth_reg01" con contraseña "Clave2026!" y rol "AGENDADOR"
    Entonces el sistema responde con código 200
    Y la respuesta contiene un token de acceso

  Escenario: No se puede registrar dos veces el mismo nombre de usuario
    Dado que registro el usuario "acc_auth_dup02" con contraseña "Clave2026!" y rol "AGENDADOR"
    Cuando registro de nuevo el usuario "acc_auth_dup02" con contraseña "Clave2026!" y rol "AGENDADOR"
    Entonces el sistema responde con código 400

  Escenario: Inicio de sesión exitoso con credenciales correctas
    Dado que registro el usuario "acc_auth_log03" con contraseña "Clave2026!" y rol "AGENDADOR"
    Cuando inicio sesión con usuario "acc_auth_log03" y contraseña "Clave2026!"
    Entonces el sistema responde con código 200
    Y la respuesta contiene un token de acceso

  Escenario: Inicio de sesión fallido con contraseña incorrecta
    Dado que registro el usuario "acc_auth_pw04" con contraseña "Clave2026!" y rol "AGENDADOR"
    Cuando inicio sesión con usuario "acc_auth_pw04" y contraseña "ClaveErronea!"
    Entonces el sistema responde con código 401
