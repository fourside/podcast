#!/bin/sh

if ps aux | grep -v grep | grep deno > /dev/null; then
  exit 0
fi

deno task queue
