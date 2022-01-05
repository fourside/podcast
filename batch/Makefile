.PHONY: setup clean test lint fmt

NAME := rec_radiko
ENTRY_POINT := src/mod.ts

.DEFAULT_GOAL: $(NAME)

${NAME}: clean setup
	deno compile --unstable --allow-run --import-map import_map.json --output bin/${NAME} ${ENTRY_POINT}

setup: clean
	git config --local core.hooksPath githooks
	mkdir bin

clean:
	rm -rf ./bin

test:
	deno test --import-map import_map.json

lint:
	deno lint

fmt:
	deno fmt
