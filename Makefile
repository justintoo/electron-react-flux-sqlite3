install:
	npm install
	bower install

clean:
	npm prune
	rm -rf bower_components
	rm -rf node_modules
	rm -rf public
	rm -rf dist
	find . -iname "\.DS_Store" -exec rm -f {} \;

commit: clean
	git add .
	git commit -a
