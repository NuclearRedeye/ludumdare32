ifeq ($(OS),Windows_NT)
    WATCH := inotifywait -qre close_write ${CURDIR}
else
    UNAME_S := $(shell uname -s)
    ifeq ($(UNAME_S),Linux)
        WATCH := inotifywait -qre close_write ${CURDIR}
    endif
    ifeq ($(UNAME_S),Darwin)
        WATCH := fswatch -1 ${CURDIR}
    endif
endif

PROJECT := $(notdir $(CURDIR))
NODE_VERSION ?= fermium-alpine

RELEASE_NAME ?= nuclearredeye/ludumdare32
RELEASE_TAG ?= local

SOURCES = $(wildcard src/**/*)

.PHONY: clean \
				distclean \
				start \
				lint \
				test

.DEFAULT_GOAL := start

# Project Specific Targets

node_modules: package.json
	@docker run --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) node:$(NODE_VERSION) npm --no-fund install

dist: node_modules $(SOURCES)
	@docker run --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) node:$(NODE_VERSION) npm run build

# Core Targets
shell:
	@docker run --rm -it -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) node:$(NODE_VERSION) sh

clean:
	@rm -rf dist

distclean: clean
	@rm -rf node_modules

lint: node_modules
	@docker run --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) node:$(NODE_VERSION) npm run lint

test: node_modules
	@docker run --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) node:$(NODE_VERSION) npm run test

start: dist
	@docker run --rm -p 5000:5000 -v $(CURDIR):/$(PROJECT):ro -w=/$(PROJECT) node:$(NODE_VERSION) npm run debug

watch: dist
	@docker run --rm -p 5000:5000 -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) node:$(NODE_VERSION) sh -c "npm run debug; nodemon --watch ./src --exec \"npm run build\""

release: dist
	@docker build . -t $(RELEASE_NAME):$(RELEASE_TAG)

