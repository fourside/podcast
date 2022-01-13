.PHONY: setup clean test lint fmt

NAME := rec_radiko
ENTRY_POINT := src/mod.ts
SQS_ENTRY_POINT := src/sqs/mod.ts
ARG :=

.DEFAULT_GOAL: $(NAME)

${NAME}: run

run:
	deno run --unstable --allow-run --allow-net --allow-env --allow-read=./ --allow-write=/public --import-map import_map.json ${ENTRY_POINT} ${ARG}

sqs:
	deno run --unstable --allow-run --allow-net --allow-env --allow-read=./ --allow-write=/public --import-map import_map.json ${SQS_ENTRY_POINT} ${ARG}

test:
	deno test --import-map import_map.json

lint:
	deno lint

fmt:
	deno fmt
