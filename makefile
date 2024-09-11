help:
	@echo -n                        "===========================$(_newline)";
	@echo -n                        "=== Important commands: ===$(_newline)";
	@echo -n                        "===========================$(_newline)$(_newline)";
	@echo -n "$(_underlined)$(_green)start$(_cleardecorations) $(_green)Main command.$(_cleardecorations) Installs, builds and runs all services.$(_newline)";
	@echo -n          "$(_underlined)stop$(_cleardecorations) Stop all running services.$(_newline)";
	@echo -n          "$(_underlined)restart$(_cleardecorations) Restart services.$(_newline)";
	@echo -n          "$(_underlined)start-dev-ui$(_cleardecorations) Run back end services and serve dev front end.$(_newline)";
	@echo -n          "$(_underlined)start-back-attached$(_cleardecorations) Run the back end only, attached.$(_newline)";
	@echo -n          "$(_underlined)test-back$(_cleardecorations) Run back end tests.$(_newline)";
	@echo -n          "$(_underlined)serve-front$(_cleardecorations) Serve front end.$(_newline)";
	@echo -n          "$(_underlined)build-back-with-docker$(_cleardecorations) Build back end dist.$(_newline)";
	@echo -n          "$(_underlined)build-front-with-docker$(_cleardecorations) Build front end dist.$(_newline)";
	@echo -n          "$(_underlined)clear-logs$(_cleardecorations) Delete log files.$(_newline)";
	@echo -n                        "===========================$(_newline)";
	@echo -n                        "Find all commands and their documentation in the 'makefile' itself. (Text file)$(_newline)";

# Starts all services detached.
#
# Installs and builds back and front ends.
# Prepares docker image, runs all services.
start:
	make pre-start-all;
	make docker-run-all;

# Restarts all services detached.
#
# Requires start to have run once.
restart:
	make docker-run-all;

# Starts all back end services detached.
# Serves development front end.
#
# Installs and builds back end.
# Prepares docker image, runs all back end services.
#
# To start the PHP My Admin service, switch profile "serve-no-ui" for
# profile "servedebug-no-ui".
start-dev-ui:
	make pre-start-docker;
	make build-back-with-docker;
	sudo docker compose --profile serve-no-ui up -V --force-recreate -d;
	make serve-front;

# Starts all back end services attached.
# Does not start front end.
# 
# Installs and builds back end.
# Prepares docker image, runs all back end services.
#
# To start the PHP My Admin service, switch profile "serve-no-ui" for
# profile "servedebug-no-ui".
start-back-attached:
	make stop;
	make build-back-with-docker;
	sudo docker compose --profile serve-no-ui up -V --force-recreate;

# Performs all install and build.
#
# - Stops all services
# - Builds back end
# - Builds front end
# - Resets logs
# - Clears back end Docker image
# - Prunes Docker images
# - Prunes Docker build cache (to force clean image rebuild)
pre-start-all:
	make stop;
	make build-apps-with-docker;
	make clear-logs;
	make docker-nuke-image;
	make docker-nuke-builder;

# Performs Docker cleanup tasks.
# To be used when only the back end is built.
#
# - Stops all services
# - Resets logs
# - Clears back end Docker image
# - Prunes Docker images
# - Prunes Docker build cache (to force clean image rebuild)
pre-start-docker:
	make stop;
	make clear-logs;
	make docker-nuke-image;
	make docker-nuke-builder;

# Stops all services.
#
# Removes volumes.
stop:
	sudo docker compose down -v;

# Starts the development front server.
serve-front:
	cd front && npm run start;

# Runs back end tests in the back directory.
test-back:
	cd back && npm run test;

# Builds the back end using local install.
#
# - Resets build dir
# - Installs dev & prod dependencies
# - Runs build
build-back-local:
	make clear-back-dist;
	cd back && npm ci;
	cd back && npm run build;

# Builds the back end using a container.
#
# - Resets build dir
# - Runs install & build in container
build-back-with-docker: 
	make clear-back-dist;
	sudo docker compose -f docker-compose.build-apps.yaml --profile back up;

# Builds the front end using local install.
#
# - Resets build dir
# - Installs dev & prod dependencies
# - Runs build
build-front-local:
	make clear-front-dist;
	cd front && npm ci;
	cd front && npm run build:prod;

# Builds the front end using a container.
#
# - Resets build dir
# - Runs install & build in container
build-front-with-docker: 
	make clear-front-dist;
	sudo docker compose -f docker-compose.build-apps.yaml --profile front up;

# Builds back & front ends using a container.
#
# - Resets build dirs
# - Runs install & build in container
build-apps-with-docker: 
	make clear-back-dist;
	make clear-front-dist;
	sudo docker compose -f docker-compose.build-apps.yaml --profile all up;

# Runs all services.
#
# To start the PHP My Admin service, switch profile "serve" for
# profile "servedebug".
docker-run-all:
	sudo docker compose --profile serve up -V --force-recreate -d;

# Resets the front end build directory.
clear-front-dist:
	rm -rf front-dist;
	mkdir -p front-dist;

# Resets the back end build directory.
clear-back-dist:
	rm -rf back-dist;
	mkdir -p back-dist;

# Remove logs.
clear-logs:
	mkdir -p ./docker-logs;
	rm -rf ./docker-logs/*;
	mkdir -p ./docker-logs/controllers;
	mkdir -p ./docker-logs/middleware;
	mkdir -p ./docker-logs/models;
	
###########################################################################
#####                           DANGER ZONE                           #####
###########################################################################

# docker-nuke-image
# - removes all traces of the docker image of the app
docker-nuke-image:
	make stop;
	sudo docker image rm product-management-demo:alpha1.0 || true;
	@printf $(_DANGER) "Next operation will prune Docker's images.";
	@printf "$(_newline)" "";
	@printf $(_DANGER) "Are you sure to proceed? [y/";
	@printf $(_SAFE) "N";
	@printf $(_DANGER) "] ";
	@read ans && ans=$${ans:-N} ; \
	if [ $${ans} = y ] || [ $${ans} = Y ]; then \
	printf $(_DANGER) "Yes, proceed."; \
	printf "$(_newline)" ""; \
	sudo docker image prune -f; \
	else \
	printf $(_SAFE) "No, skip."; \
	printf "$(_newline)" ""; \
	fi;


# docker-nuke-builder
# - removes build cache
docker-nuke-builder:
	make stop;
	@printf $(_DANGER) "Next operation will prune Docker's build cache.";
	@printf "$(_newline)" "";
	@printf $(_DANGER) "Are you sure to proceed? [y/";
	@printf $(_SAFE) "N";
	@printf $(_DANGER) "] ";
	@read ans && ans=$${ans:-N} ; \
	if [ $${ans} = y ] || [ $${ans} = Y ]; then \
	printf $(_DANGER) "Yes, proceed."; \
	printf "$(_newline)" ""; \
	sudo docker builder prune -f; \
	else \
	printf $(_SAFE) "No, skip."; \
	printf "$(_newline)" ""; \
	fi;

###########################################################################
#####                           CONSTANTS                             #####
###########################################################################

_green :=\033[32m
_red :=\033[31m
_underlined :=\033[4m
_cleardecorations :=\033[0m
_newline :=\n
_SAFE := "$(_green)%s$(_cleardecorations)"
_DANGER := "$(_red)%s$(_cleardecorations)"
	
