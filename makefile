help:
	@echo -n "$(_underlined)=== Supported commands: ===$(_cleardecorations)$(_newline)";
	@echo -n "$(_underlined)> GLOBAL$(_cleardecorations)$(_newline)";
	@echo -n "\033[32mstart-all\033[0m (\033[32myou should start here\033[0m - Interactive)$(_newline)";
	@echo -n "$(_underlined)> BACK$(_cleardecorations)$(_newline)";
	@echo -n "start (Interactive)\n";
	@echo -n "start-attached (Interactive)$(_newline)";
	@echo -n "pre-start (Interactive)$(_newline)";
	@echo -n "stop$(_newline)";
	@echo -n "test-back$(_newline)";
	@echo -n "build-back$(_newline)";
	@echo -n "clear-logs$(_newline)";
	@echo -n "docker-nuke-image (Interactive)$(_newline)";
	@echo -n "docker-nuke-builder (Interactive)$(_newline)";
	@echo -n "$(_underlined)> FRONT$(_cleardecorations)$(_newline)";
	@echo -n "serve-front$(_newline)";

# start-all
# Starts back and front ends
# Back end stack starts detached
# Front end is served as dev server in terminal
start-all:
	make start;
	make serve-front;

# pre-start
# Performs common operations for a start sequence
# - Stops back end if running
# - Rebuilds back end
# - Resets logs
# - Clears back end Docker image
# - Clears Docker build cache to force rebuilding back end image
pre-start:
	make stop;
	make build-back;
	make clear-logs;
	make docker-nuke-image;
	make docker-nuke-builder;

# start
# Starts the back end stack detached.
# Switch between "serve" and "servedebug" profiles to
# toggle phpmyadmin (servedebug) or not (serve)
# - call docker compose to build and run
start:
	make pre-start;
	sudo docker-compose --profile servedebug up -V --force-recreate -d;

# start-attached
# Starts the back end stack attached to the terminal
# Switch between "serve" and "servedebug" profiles to
# toggle phpmyadmin (servedebug) or not (serve)
# - call docker compose to build and run
start-attached:
	make pre-start;
	sudo docker-compose --profile servedebug up -V --force-recreate;

# stop
# Stops back end stack containers
stop:
	sudo docker-compose down -v;

# serve-front
# Starts the front server
serve-front:
	cd front && npm run start;

# test-back
# Runs back end tests in the back directory
test-back:
	cd back && npm run test;

# build-back
# Builds the back end
# - removes build dir
# - install dev dependencies
# - run build
build-back:
	rm -rf back-dist;
	cd back && npm i;
	cd back && npm run build;

# clear-logs
clear-logs:
	mkdir -p ./docker-logs/controllers;
	mkdir -p ./docker-logs/middleware;
	mkdir -p ./docker-logs/models;
	rm -rf ./docker-logs/controllers/*;
	rm -rf ./docker-logs/middleware/*;
	rm -rf ./docker-logs/models/*;
	rm -rf ./docker-logs/*.log;
	
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
	
