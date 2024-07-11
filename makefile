# start
# - calls back end build
# - builds docker
# - runs docker
start:
	make build-back;
	make docker-build-backend;
	make docker-run-backend;

# test-back
# Runs tests in the back directory
test-back:
	cd back && npm run test;

# test-built
# Runs tests in the back-dist directory
# - calls back end build
test-built:
	make build-back
	cp back/package.json back-dist/;
	cd back-dist && npm i --omit=dev;
	cd back-dist && npm run built:test;

# build-back
# Builds the back end
# - removes build dir
# - install dev dependencies
# - run build
build-back:
	rm -rf back-dist;
	cd back && npm i;
	cd back && npm run build;

# docker-test-backend
docker-test-backend:
	sudo docker run --rm -i --entrypoint=/bin/sh product-management-demo:alpha1 -c "npm run built:test";

# docker-run-backend
docker-run-backend:
	mkdir -p ./docker-logs;
	sudo docker run -i --rm -v ./docker-logs:/app/logs product-management-demo:alpha1;

# docker-build-backend
docker-build-backend:
	make docker-ensure-buildx;
	sudo docker buildx build --no-cache -f Dockerfile.back.dev -t product-management-demo:alpha1 .;

# docker-ensure-buildx
docker-ensure-buildx:
	@if sudo docker buildx inspect | grep "Name:" -q; then \
		echo "Docker buildx is installed."; else \
		make docker-install-buildx; \
	fi;

# docker-install-buildx
docker-install-buildx:
	sudo apt-get install docker-buildx;

# docker-nuke-image
# - removes all traces of the docker image of the app
docker-nuke-image:
	sudo docker image rm product-management-demo:alpha1;
	sudo docker image prune -f;