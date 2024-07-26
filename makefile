# start
# - calls back end build
# - call docker compose to build and run
start:
	make build-back;
	mkdir -p ./docker-logs/controllers;
	sudo docker builder prune -f;
	sudo docker-compose --profile serve up -V --force-recreate -d;

# start-attached
# - calls back end build
# - call docker compose to build and run
start-attached:
	make build-back;
	mkdir -p ./docker-logs/controllers;
	sudo docker builder prune -f;
	sudo docker-compose --profile serve up -V --force-recreate;

# start-all
# Starts back and front ends
start-all:
	make start;
	make serve-front;

# stop
# Stops running containers
stop:
	sudo docker-compose down -v;

# serve-front
# Starts the front server
serve-front:
	cd front && npm run start;

# test-back
# Runs tests in the back directory
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
	
###########################################################################
#####                           DEPRECATED                            #####
###########################################################################

# test-built
# (DEPRECATED) until build:test is updated to use DB
# Runs tests in the back-dist directory
# - calls back end build
test-built:
	make build-back
	cp back/package.json back-dist/;
	cd back-dist && npm i --omit=dev;
	cd back-dist && npm run built:test;

# docker-test-backend
# (DEPRECATED) use compose instead (database is required for testing)
docker-test-backend:
	sudo docker run --rm -i --entrypoint=/bin/sh product-management-demo:alpha1 -c "npm run built:test";

# docker-run-backend
# (DEPRECATED) replaced by `make start`
docker-run-backend:
	sudo docker run -i --rm -v ./docker-logs:/app/logs product-management-demo:alpha1;

# docker-build-backend
# (DEPRECATED) replaced by compose build
docker-build-backend:
	make docker-ensure-buildx;
	sudo docker buildx build --no-cache -f Dockerfile.back.dev -t product-management-demo:alpha1 .;

# docker-ensure-buildx
# (DEPRECATED) unnecessary for compose build
docker-ensure-buildx:
	@if sudo docker buildx inspect | grep "Name:" -q; then \
		echo "Docker buildx is installed."; else \
		make docker-install-buildx; \
	fi;

# docker-install-buildx
# (DEPRECATED) unnecessary for compose build
docker-install-buildx:
	sudo apt-get install docker-buildx;
