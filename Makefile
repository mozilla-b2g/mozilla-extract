default: test

test/extract-out:
	mkdir test/extract-out

test/fixtures:
	mkdir test/fixtures
	node fixtures.js

node_modules:
	npm install

.PHONY: test
test: node_modules test/fixtures test/extract-out
	./node_modules/mocha/bin/mocha \
		$(shell find . -path ./node_modules -prune -o -name '*_test.js' -type f)

.PHONY: clean
clean:
	rm -Rf test/darwin-out test/extract-out test/linux-out
