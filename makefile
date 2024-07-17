# start
# - calls back end build
# - call docker compose to build and run
start:
	make build-back;
	mkdir -p ./docker-logs/controllers;
	sudo docker builder prune -f;
	sudo docker-compose --profile serve up -V --force-recreate;

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

# docker-nuke-image
# - removes all traces of the docker image of the app
docker-nuke-image:
	sudo docker-compose down -v;
	sudo docker image rm product-management-demo:alpha1.0;
	sudo docker image prune -f;
	
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
