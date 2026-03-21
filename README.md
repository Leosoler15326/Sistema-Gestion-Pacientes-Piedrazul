# [dentro de Frontend]
	npm install
# crear archivo de variables de entorno:
	cp .env.example .env.local

# [dentro de Backend]
	mvn install -DskipTests
# crear archivo de variables de entorno:
	cp .env.example .env


EJECUTAR TODO:
# Terminal 1 — Base de datos
	docker-compose up -d

# Terminal 2 — Backend
	mvn spring-boot:run

# Terminal 3 — Frontend
	npm run dev

VERIFICACIONES DE FUNCIONAMIENTO:
# Backend responde
	http://localhost:8080/api/health

# Frontend
	http://localhost:5173

# APAGAR TODO:
[para front y back]
	ctrl+c 
[para docker]
	docker-compose stop 
