.PHONY: combine dev build lint preview

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

preview:
	npm run preview

OUT ?= combined.txt
combine:
	@rm -f $(OUT)
	@echo "# Geometria Musical — Codigo fuente completo" > $(OUT)
	@echo "" >> $(OUT)
	@echo "Reconstruir: \`npm install && npm run dev\`" >> $(OUT)
	@echo "" >> $(OUT)
	@echo "---" >> $(OUT)
	@echo "" >> $(OUT)
	@for f in \
		package.json \
		vite.config.ts \
		tsconfig.json \
		index.html \
		src/main.tsx \
		src/index.css \
		src/lib/theory.ts \
		src/components/CircleChromatic.tsx \
		src/components/LessonCircle.tsx \
		src/data/lessonsContent.ts \
		src/App.tsx; do \
		echo "## $$f" >> $(OUT); \
		echo "" >> $(OUT); \
		echo '```' >> $(OUT); \
		cat "$$f" >> $(OUT); \
		echo "" >> $(OUT); \
		echo '```' >> $(OUT); \
		echo "" >> $(OUT); \
	done
	@echo "---" >> $(OUT)
	@echo "Total: $$(wc -l < $(OUT)) lineas, $$(wc -c < $(OUT)) bytes" >> $(OUT)
	@echo "Creado $(OUT)  ($$(wc -l < $(OUT)) lineas, $$(wc -c < $(OUT)) bytes)"
