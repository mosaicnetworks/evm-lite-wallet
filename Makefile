up: install build start

install:
	bash -c "npm install"

build:
	bash -c "npm run build"

start-dev:
	bash -c "npm run start:dev"

start:
	bash -c "npm run start:electron"

link:
	bash -c "npm link"

.PHONY: up link install
