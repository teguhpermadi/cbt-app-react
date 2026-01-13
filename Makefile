# Docker commands for CBT Application
# Usage: make [command]

.PHONY: help build up down restart logs shell migrate seed fresh test clean

# Default target
.DEFAULT_GOAL := help

# Docker Compose command (v2 uses 'docker compose', v1 uses '$(DOCKER_COMPOSE)')
DOCKER_COMPOSE := docker compose

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)CBT Application - Docker Commands$(NC)"
	@echo ""
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

build: ## Build Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	$(DOCKER_COMPOSE) build --no-cache

up: ## Start all services
	@echo "$(BLUE)Starting services...$(NC)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)Services started! Access the app at http://localhost$(NC)"

up-dev: ## Start all services in development mode
	@echo "$(BLUE)Starting development services...$(NC)"
	$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml up -d
	@echo "$(GREEN)Development services started!$(NC)"
	@echo "$(GREEN)App: http://localhost:8000$(NC)"
	@echo "$(GREEN)Vite: http://localhost:5173$(NC)"
	@echo "$(GREEN)pgAdmin: http://localhost:5050$(NC)"
	@echo "$(GREEN)Redis Commander: http://localhost:8081$(NC)"

down: ## Stop all services
	@echo "$(YELLOW)Stopping services...$(NC)"
	$(DOCKER_COMPOSE) down

restart: ## Restart all services
	@echo "$(YELLOW)Restarting services...$(NC)"
	$(DOCKER_COMPOSE) restart

logs: ## Show logs from all services
	$(DOCKER_COMPOSE) logs -f

logs-app: ## Show logs from app service
	$(DOCKER_COMPOSE) logs -f app

logs-queue: ## Show logs from queue service
	$(DOCKER_COMPOSE) logs -f queue

shell: ## Access app container shell
	$(DOCKER_COMPOSE) exec app sh

shell-postgres: ## Access PostgreSQL container shell
	$(DOCKER_COMPOSE) exec postgres psql -U postgres -d cbt_app

shell-redis: ## Access Redis CLI
	$(DOCKER_COMPOSE) exec redis redis-cli

migrate: ## Run database migrations
	@echo "$(BLUE)Running migrations...$(NC)"
	$(DOCKER_COMPOSE) exec app php artisan migrate --force

migrate-fresh: ## Fresh migration (WARNING: will drop all tables)
	@echo "$(YELLOW)Running fresh migration...$(NC)"
	$(DOCKER_COMPOSE) exec app php artisan migrate:fresh --force

seed: ## Run database seeders
	@echo "$(BLUE)Running seeders...$(NC)"
	$(DOCKER_COMPOSE) exec app php artisan db:seed --force

fresh: ## Fresh install with migrations and seeders
	@echo "$(BLUE)Fresh installation...$(NC)"
	$(DOCKER_COMPOSE) exec app php artisan migrate:fresh --seed --force
	@echo "$(GREEN)Fresh installation completed!$(NC)"

optimize: ## Optimize Laravel caches
	@echo "$(BLUE)Optimizing caches...$(NC)"
	$(DOCKER_COMPOSE) exec app php artisan config:cache
	$(DOCKER_COMPOSE) exec app php artisan route:cache
	$(DOCKER_COMPOSE) exec app php artisan view:cache
	@echo "$(GREEN)Optimization completed!$(NC)"

clear: ## Clear all Laravel caches
	@echo "$(YELLOW)Clearing caches...$(NC)"
	$(DOCKER_COMPOSE) exec app php artisan config:clear
	$(DOCKER_COMPOSE) exec app php artisan route:clear
	$(DOCKER_COMPOSE) exec app php artisan view:clear
	$(DOCKER_COMPOSE) exec app php artisan cache:clear
	@echo "$(GREEN)Caches cleared!$(NC)"

test: ## Run tests
	$(DOCKER_COMPOSE) exec app php artisan test

queue-work: ## Start queue worker
	$(DOCKER_COMPOSE) exec app php artisan queue:work --verbose

tinker: ## Open Laravel Tinker
	$(DOCKER_COMPOSE) exec app php artisan tinker

npm-install: ## Install NPM dependencies
	$(DOCKER_COMPOSE) exec app npm install

npm-build: ## Build frontend assets
	$(DOCKER_COMPOSE) exec app npm run build

clean: ## Clean up containers, volumes, and images
	@echo "$(YELLOW)Cleaning up...$(NC)"
	$(DOCKER_COMPOSE) down -v
	docker system prune -f
	@echo "$(GREEN)Cleanup completed!$(NC)"

status: ## Show status of all services
	$(DOCKER_COMPOSE) ps

init: ## Initialize project (first time setup)
	@echo "$(BLUE)Initializing project...$(NC)"
	@echo "$(YELLOW)Please copy .env.docker to .env and update it$(NC)"
	@echo "$(BLUE)Building images...$(NC)"
	$(DOCKER_COMPOSE) build
	@echo "$(BLUE)Starting services...$(NC)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(BLUE)Waiting for services to be ready...$(NC)"
	@timeout /t 10 /nobreak
	@echo "$(BLUE)Running setup...$(NC)"
	$(DOCKER_COMPOSE) exec app php artisan key:generate
	$(DOCKER_COMPOSE) exec app php artisan migrate --force
	@echo "$(GREEN)Project initialized! Access at http://localhost$(NC)"

backup-db: ## Backup PostgreSQL database
	@echo "$(BLUE)Backing up database...$(NC)"
	$(DOCKER_COMPOSE) exec postgres pg_dump -U postgres cbt_app > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Database backup completed!$(NC)"

restore-db: ## Restore PostgreSQL database (Usage: make restore-db FILE=backup.sql)
	@echo "$(YELLOW)Restoring database from $(FILE)...$(NC)"
	$(DOCKER_COMPOSE) exec -T postgres psql -U postgres -d cbt_app < $(FILE)
	@echo "$(GREEN)Database restored!$(NC)"
