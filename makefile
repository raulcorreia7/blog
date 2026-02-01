.PHONY: all clean watch dev public dependencies

HUGO  := hugo
FLAGS := --gc --minify
DEST  := public
PORT  := 1313
GIT	  := git
DEV_FLAGS := --buildFuture --buildDrafts --buildExpired
# Run all targets
all: public

help:
	@echo "Usage: make <command>"
	@echo "  all     Builds the blog and minifies it"
	@echo "  clean   Cleans all build files"
	@echo "  server  Runs a webserver on port 1313 to test the final minified result"
	@echo "  watch   Runs hugo in watch mode, waiting for changes"
	@echo ""
	@echo "New article:"
	@echo "  hugo new post/the_title"
	@echo "  $$EDITOR content/post/the_title.md"
	@echo "  make dev"
	@echo "  make watch"
	@echo "  open "

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

dependencies:
	$(GIT) submodule update --recursive --init

init : clean dependencies