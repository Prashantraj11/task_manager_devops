# Task Manager DevOps

A full-stack Task Manager application with a modern frontend, RESTful backend, MongoDB database, and robust DevOps pipeline. Supports local, Docker Compose, and Kubernetes deployments.

---

## Features
- Add, view, and complete tasks
- Responsive, modern UI (Bootstrap)
- Animated particle background (particles.js)
- RESTful API (Node.js, Express, MongoDB)
- Nginx serves frontend and proxies API
- Dockerized for easy deployment
- Kubernetes manifests for production
- CI/CD pipeline with GitHub Actions

---

## System Architecture

```mermaid
flowchart TD
    %% ─────────── Client ───────────
    subgraph Client
        U[User]
    end

    %% ───────── Front-end (port 3001) ─────────
    subgraph Frontend
        FE[Next.js App\n(port 3001)]
    end

    %% ───────── Back-end (port 4000) ─────────
    subgraph Backend
        BE[Node API\n(port 4000)]
    end

    %% ─────────── Database ───────────
    DB[(PostgreSQL)]

    %% ───────────── Edges ─────────────
    U  -- "HTTP" --> FE
    FE -- "REST API" --> BE
    BE -- "SQL" --> DB
```

- **Frontend:** Next.js app running on port 3001.
- **Backend:** Node.js API running on port 4000.
- **Database:** PostgreSQL for persistent storage.

---

## System Design Details

### Frontend
- **Tech:** HTML, CSS (Bootstrap), JS, particles.js, Nginx
- **Features:**
  - Task list UI, add/complete tasks
  - Animated background (customizable)
  - API requests proxied to backend
- **Nginx:**
  - Serves static files
  - Proxies `/api` to backend (see `frontend/nginx.conf`)

### Backend
- **Tech:** Node.js, Express, Mongoose
- **API Endpoints:**
  - `GET /api/tasks` – List all tasks
  - `POST /api/tasks` – Add a new task (`{ title }`)
  - `PUT /api/tasks/:id` – Mark task as completed
- **Data Model:**
  - `Task`: `{ title: String, completed: Boolean, timestamps }`
- **MongoDB:** Stores all tasks

### DevOps & Deployment
- **Docker Compose:**
  - Services: `frontend` (Nginx), `backend` (Node.js), `mongo` (MongoDB)
  - One command to run all: `docker-compose up --build`
- **Kubernetes:**
  - Deployments/services for frontend, backend, mongo
  - ConfigMap for Nginx config
  - Health checks, resource limits
- **CI/CD:**
  - GitHub Actions workflow: test, build, push Docker images, deploy to Kubernetes

---

## Getting Started

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- (Optional) [kubectl](https://kubernetes.io/docs/tasks/tools/) & Kubernetes cluster
- Node.js (for local dev)

### 2. Local Development (Node.js)
```sh
cd backend
npm install
npm start
# Visit http://localhost:5000/api/tasks
```
Open `frontend/index.html` directly in your browser for static preview.

### 3. Docker Compose (Recommended)
```sh
# From project root
cd /path/to/task-manager-devops
# Build and start all services
docker-compose up --build
# Frontend: http://localhost:3001
# Backend API: http://localhost:5000/api/tasks
```

### 4. Kubernetes
- Update image names in `k8s/app-deployment.yaml` to your Docker Hub repo
- Apply manifests:
```sh
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongo-deployment.yaml
kubectl apply -f k8s/app-deployment.yaml
```
- Access via LoadBalancer or port-forward as needed

---

## CI/CD Pipeline
- **Location:** `.github/workflows/deploy.yml`
- **Steps:**
  1. Run backend tests
  2. Build & push Docker images to Docker Hub
  3. Deploy to Kubernetes (applies manifests)
- **Secrets needed:**
  - `DOCKER_HUB_USERNAME`, `DOCKER_HUB_TOKEN` (in GitHub repo settings)

---

## Customization
- **Particles.js:** Edit config in `frontend/index.html` for color, density, etc.
- **Nginx:** Change proxy rules in `frontend/nginx.conf`
- **API:** Extend backend/routes/task.js for more features

---
