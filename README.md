chroma + ollama
===

### 1. Start Chroma

```bash
python3 -m venv ./venv
./venv/bin/pip install chromadb
./venv/bin/chroma run --path ./chroma.db
```

or

```
docker run -d -p 8000:8000 -v $(pwd)/chroma.db:/chroma/chroma chromadb/chroma
```


### 2. Exec script

```bash
yarn install
node index.js
```


### Documents

- https://github.com/ollama/ollama-js
- https://docs.trychroma.com/getting-started?lang=js
- https://ollama.com/blog/embedding-models
