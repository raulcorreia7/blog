.PHONY: all clean watch dev stop public hooks

HUGO  := hugo
FLAGS := --gc --minify --cleanDestinationDir
DEST  := public
PORT  := 1313
DEV_FLAGS := --buildFuture --buildDrafts --buildExpired
# Run all targets
all: public

help:
	@echo "Usage: make <command>"
	@echo "  all          Build the blog into ./public (minified)"
	@echo "  clean        Remove build output"
	@echo "  dev          Run local dev server (drafts/future/expired enabled)"
	@echo "  watch        Run local dev server in watch mode"
	@echo "  stop         Stop local dev server on port $(PORT)"
	@echo "  public       Build only"
	@echo "  hooks        Install git hooks from .githooks"
	@echo ""
	@echo "New article:"
	@echo "  hugo new posts/the-title/index.md"
	@echo "  \$$EDITOR content/posts/the-title/index.md"
	@echo "  make dev"
	@echo "  open http://localhost:$(PORT)"

clean:
	rm -rf public/

watch: clean
	@echo "Checking for existing Hugo server on port $(PORT)..."
	@lsof -ti :$(PORT) | xargs kill -9 2>/dev/null || true
	$(HUGO) server -w $(DEV_FLAGS) --port $(PORT) --bind 127.0.0.1

stop:
	@echo "Stopping Hugo server on port $(PORT)..."
	@lsof -ti :$(PORT) | xargs kill -9 2>/dev/null || echo "No Hugo server found on port $(PORT)"

dev:
	@echo "Checking for existing Hugo server on port $(PORT)..."
	@lsof -ti :$(PORT) | xargs kill -9 2>/dev/null || true
	@echo "Starting Hugo dev server on http://localhost:$(PORT)"
	$(HUGO) server $(DEV_FLAGS) --port $(PORT) --bind 127.0.0.1 &
	@sleep 2
	@echo "Hugo server running at http://localhost:$(PORT)"
	@echo "Use 'make stop' to stop the server"

public:
	$(HUGO) $(FLAGS) -d $(DEST)

hooks:
	./scripts/install-hooks.sh
