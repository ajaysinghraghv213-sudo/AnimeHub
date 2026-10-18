# Articles

Articles is a full-stack social publishing application. Users can discover and publish posts, follow other users, discuss content, and chat in real time.

## Features

- User registration with email OTP verification and JWT-based login.
- Create, browse, feature, and categorize posts, including image and video uploads.
- Like posts, add comments and replies, and browse related or recent posts.
- User profiles, profile updates, follow lists, and blocked-user controls.
- Direct messaging with real-time delivery, online presence, typing indicators, and read status.
- Email contact form and email subscription for updates.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Redux Toolkit, Tailwind CSS.
- **Backend:** Django 6, Django REST Framework, Simple JWT, Django Channels.
- **Data and services:** MySQL, Redis, SMTP email, and locally stored media uploads.
- **Containers:** Docker and Docker Compose configuration are included.

## Repository Layout

```text
Articles(project)/
├── Backend/
│   ├── manage.py
│   ├── requirements.txt
│   └── mains/
│       ├── homes/          # Posts, users, chat, API
│       └── mains/          # Django project settings and routing
├── Frontend/
│   ├── app/                # Next.js routes
│   ├── Components/         # UI components
│   ├── function/           # Frontend API helpers
│   └── package.json
└── docker-compose.yaml
```

## Requirements

- Node.js 22 or later and npm.
- Python 3.12 or later.
- MySQL and Redis for backend features.

Docker is optional. The backend settings currently use a MySQL database named `article` at `localhost:3306` and Redis at `localhost:6379`. Create/configure the database and update the Django settings for your local services before starting the backend. Email verification and contact email require working SMTP settings.

## Run Locally

Start the backend and frontend in separate terminals.

### 1. Configure the backend services

Create a MySQL database named `article`, and start MySQL and Redis. Review `Backend/mains/mains/settings.py` and configure its database, Redis, allowed hosts, CORS origins, and SMTP settings for your environment. Do not commit real credentials; move secrets to environment variables before deploying.

### 2. Install and start Django

From the repository root, run:

```powershell
cd Backend
python -m venv env
.\env\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API and Django admin are served at `http://localhost:8000/` and `http://localhost:8000/admin/`.

### 3. Install and start Next.js

In a second terminal, from the repository root, run:

```powershell
cd Frontend
npm install
npm run dev
```

Open `http://localhost:3000/`. Frontend API helper modules are in `Frontend/function/`; configure their backend URL there if it differs from the local backend address.

To create an administrator account, run `python manage.py createsuperuser` from `Backend/` with the virtual environment active.

## Docker Compose

The included `docker-compose.yaml` currently refers to lowercase `./frontend` and `./backend`, but the repository directories are named `Frontend/` and `Backend/`. The frontend Dockerfile also exposes port `5173`, while Next.js normally serves on port `3000`. As checked in, these settings do not match the repository layout and local Next.js port; update the Compose build paths and port mapping before relying on `docker compose up --build`.

The backend also requires MySQL and Redis, but the current Compose file does not define those services. Configure reachable database and Redis services before running the backend in containers.

## Useful Commands

From `Frontend/`:

```bash
npm run dev
npm run lint
npm run build
```

From `Backend/` with its virtual environment active:

```bash
python manage.py migrate
python manage.py test
python manage.py runserver
```

## Security Notes

- Replace hard-coded Django credentials and secret values with environment-based configuration.
- Rotate any credentials that have been committed to source control.
- Set `DEBUG=False`, configure production `ALLOWED_HOSTS`, and restrict CORS/CSRF origins before deployment.
- Use HTTPS and production-grade database, media storage, and application servers in production.

## License

No license is currently specified. Add a license file if you intend to grant permissions for others to use or distribute this project.