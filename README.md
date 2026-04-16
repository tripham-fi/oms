# OMS - Order Management System

A full-stack application for managing users, rooms, and bookings built with **React + MobX** (frontend) and **Spring Boot** (backend).

## Tech Stack

- **Frontend**: React 18 + TypeScript + MobX + Semantic UI
- **Backend**: Spring Boot 3 + Spring Security + JWT + PostgreSQL
- **Database**: PostgreSQL (with H2 for local development)

## Project Structure
```bash
oms/                          ← Root folder
├── src/                      ← Spring Boot source code
├── target/                   ← Maven build output
├── pom.xml
├── docker-compose.yml        ← PostgreSQL setup
│
└── clients/                  ← React Frontend
    ├── src/
    ├── public/
    ├── package.json
    └── vite.config.ts
```
## Backend setup
### Option A: PostgreSQL with Docker
1. Create a file named `docker-compose.yml` in the root of the **backend** project:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: oms-postgres
    restart: always
    environment:
      POSTGRES_DB: oms_db
      POSTGRES_USER: oms_user
      POSTGRES_PASSWORD: oms_password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - oms-network

volumes:
  postgres_data:

networks:
  oms-network:
    driver: bridge
```
2. Start PostgreSQL:
```bash
docker-compose up -d
```
3. Run the Spring Boot application.

### Option B: H2 Database (for quick testing)
- Go to Run → Edit Configurations
- Add to VM options
```text
-Dspring.profiles.active=h2
```

In Visual Studio Code:
Create or edit .vscode/launch.json in the backend project root:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "OMS Backend (H2)",
      "request": "launch",
      "mainClass": "fi.haagahelia.oms.OmsApplication",
      "vmArgs": "-Dspring.profiles.active=h2",
      "projectName": "oms"
    }
  ]
}
```
Then run using:
Press F5 (or Run → Start Debugging), or
Use the Run and Debug panel and select "OMS Backend (H2)"

## Frontend setup
```bash
cd clients
npm install
npm run dev
```
Frontend runs at: http://localhost:5173
Backend swagger runs at: http://localhost:8080/swagger-ui.html
