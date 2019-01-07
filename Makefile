up: install start-dev

install:
	bash -c "npm install"

build:
	bash -c "npm run build"

start-dev:
	bash -c "npm run start:dev"

electron:
	bash -c "npm run start:electron"

link:
	bash -c "npm link"

.PHONY: up link install
