.PHONY: all clean watch public dependencies

HUGO  := hugo
FLAGS := --gc --minify
DEST  := public
PORT  := 1313
GIT	  := git
# Run all targets
all: public

help:
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
	@echo "  make watch"
	@echo "  open "

clean:
	rm -rf public/

watch: clean
	$(HUGO) server -w

public:
	$(HUGO) $(FLAGS) -d $(DEST)

dependencies:
	$(GIT) submodule update --recursive --init