-- Ejecutar UNA VEZ en PostgreSQL (psql, DBeaver, etc.) si al reactivar usuarios
-- falla con: violates check constraint "auditoria_tipo_evento_check"
--
-- Conexión típica: psql -h localhost -U dev -d sgp_piedrazul -f fix-auditoria-tipo-evento-check.sql

DO $body$
BEGIN
    IF to_regclass('public.auditoria') IS NOT NULL THEN
        ALTER TABLE auditoria DROP CONSTRAINT IF EXISTS auditoria_tipo_evento_check;
        ALTER TABLE auditoria ADD CONSTRAINT auditoria_tipo_evento_check CHECK (tipo_evento IN (
            'USUARIO_CREADO',
            'USUARIO_MODIFICADO',
            'USUARIO_DESACTIVADO',
            'USUARIO_REACTIVADO',
            'CITA_AGENDADA',
            'CITA_REAGENDADA',
            'CITA_CANCELADA',
            'HISTORIA_REGISTRADA',
            'HISTORIA_MODIFICADA',
            'LOGIN_EXITOSO',
            'LOGIN_FALLIDO',
            'PROFESIONAL_CREADO',
            'PROFESIONAL_MODIFICADO'
        ));
    END IF;
END
$body$;

-- Si instalaste Flyway antes y quedó la tabla de metadatos, puedes borrarla (opcional):
-- DROP TABLE IF EXISTS flyway_schema_history;
