.PHONY: setup clean test lint fmt

NAME := rec_radiko
ENTRY_POINT := src/mod.ts
ARG :=

.DEFAULT_GOAL: $(NAME)

${NAME}: clean setup
	deno run --unstable --allow-run --allow-net --allow-env --import-map import_map.json ${ENTRY_POINT} ${ARG}

setup:
	git config --local core.hooksPath githooks


test:
	deno test --import-map import_map.json

lint:
	deno lint

fmt:
	deno fmt
