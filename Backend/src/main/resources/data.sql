-- Solo inserta si no existe ya un admin
INSERT INTO usuarios (
    nombre_usuario,
    contrasena,
    nombre_completo,
    email,
    rol,
    estado,
    email_verificado,
    intentos_fallidos_login,
    creado_en,
    actualizado_en
)
SELECT
    'admin',
    '$2a$10$0urcelnR3ixxc1ShrU5/w.hik9pMKVZswuF7xCusJXdZx.oajYgiS', -- Contraseña: Admin123! (bcrypt)
    'Administrador del Sistema',
    'admin@hospital.local',
    'ADMINISTRADOR',
    'ACTIVO',
    true,
    0,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE nombre_usuario = 'admin'
);