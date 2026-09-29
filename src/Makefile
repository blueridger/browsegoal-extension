BUILD := ../build
FILES := main.js browser-polyfill.min.js icons options
VERSION := $(shell sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' manifest.json)

# `make FORCE=1` rebuilds a version that already has a zip
ifdef FORCE
OVERWRITE := --overwrite-dest
endif

.PHONY: build chrome firefox clean check-version

build: check-version chrome firefox

# refuse to rebuild an existing version unless FORCE is set
define check-exists
@if [ -z "$(FORCE)" ] && ls $(BUILD)/artifacts/$(1)/*-$(VERSION).zip >/dev/null 2>&1; then echo "$(1) $(VERSION) already built; bump the version or run 'make FORCE=1'"; exit 1; fi
endef

chrome:
	$(call check-exists,chrome)
	rm -rf $(BUILD)/chrome && mkdir -p $(BUILD)/chrome
	cp -R $(FILES) manifest.json $(BUILD)/chrome/
	web-ext build -s $(BUILD)/chrome -a $(BUILD)/artifacts/chrome $(OVERWRITE)

firefox:
	$(call check-exists,firefox)
	rm -rf $(BUILD)/firefox && mkdir -p $(BUILD)/firefox
	cp -R $(FILES) $(BUILD)/firefox/
	cp manifest.firefox.json $(BUILD)/firefox/manifest.json
	web-ext build -s $(BUILD)/firefox -a $(BUILD)/artifacts/firefox $(OVERWRITE)

# fail if the two manifests' versions drift apart
check-version:
	@a=$$(grep '"version"' manifest.json); b=$$(grep '"version"' manifest.firefox.json); \
	 [ "$$a" = "$$b" ] || { echo "version mismatch: $$a vs $$b"; exit 1; }

clean:
	rm -rf $(BUILD)
