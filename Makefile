NODE_VERSION ?= lts-alpine

SOURCES = $(wildcard src/**/*)

.PHONY: clean \
				distclean \
				start \
				lint \
				test

.DEFAULT_GOAL := start

# Specific Targets

node_modules: package.json
	@docker run -v $(CURDIR):/build:rw -w="/build" node:$(NODE_VERSION) npm install

dist: node_modules $(SOURCES)
	@docker run -v $(CURDIR):/build:rw -w="/build" node:$(NODE_VERSION) npm run build

# Core Targets

clean:
	@rm -rf dist

distclean: clean
	@rm -rf node_modules

lint: node_modules
	@docker run -v $(CURDIR):/build:rw -w="/build" node:$(NODE_VERSION) npm run lint

test: node_modules
	@docker run -v $(CURDIR):/build:rw -w="/build" node:$(NODE_VERSION) npm run test

start: dist
	@docker run -p 5000:5000 -v $(CURDIR):/debug:ro -w="/debug" node:$(NODE_VERSION) npm run debug

