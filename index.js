import ollama from 'ollama'
import { ChromaClient } from 'chromadb'

// https://ollama.com/blog/embedding-models
// Step 1: Generate embeddings
const documents = [
  "Llamas are members of the camelid family meaning they're pretty closely related to vicuñas and camels",
  "Llamas were first domesticated and used as pack animals 4,000 to 5,000 years ago in the Peruvian highlands",
  "Llamas can grow as much as 6 feet tall though the average llama between 5 feet 6 inches and 5 feet 9 inches tall",
  "Llamas weigh between 280 and 450 pounds and can carry 25 to 30 percent of their body weight",
  "Llamas are vegetarians and have very efficient digestive systems",
  "Llamas live to be about 20 years old, though some only live for 15 years and others live to be 30 years old",
];

const client = new ChromaClient({ url: "http://localhost:8000" });
const collection = await client.createCollection({ name: "docs" }).then(async (collection) => {
  //- store each document in a vector embedding database
  for (let index = 0; index < documents.length; index++) {
    const doc = documents[index];
    const response = await ollama.embeddings({ model: "llama3:8b", prompt: doc });
    const embedding = response.embedding;
    await collection.add({ ids: [index.toString()], embeddings: [embedding], documents: [doc] });
  }
  return collection;
}).catch((error) => {
  if (error.message =~ /^UniqueConstraintError\('Collection .+ already exists'\)$/) {
    return client.getCollection({ name: "docs" });
  }
  console.error(error.message);
  process.exit(1);
});

// Step 2: Retrieve
//- an example prompt
const prompt = "What animals are llamas related to?"
//- generate an embedding for the prompt and retrieve the most relevant doc
const response = await ollama.embeddings({ model: "llama3:8b", prompt });
const results = await collection.query({ queryEmbeddings: [response.embedding], nResults: 1 });
const data = results.documents[0][0];

// Step 3: Generate
//- generate a response combining the prompt and data we retrieved in step 2
const output = await ollama.generate({ model: "llama3:8b", prompt: `Using this data: ${data}. Respond to this prompt: ${prompt}` });
console.log(output.response);
