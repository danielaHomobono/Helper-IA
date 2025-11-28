from azure.search.documents import SearchClient
from azure.core.credentials import AzureKeyCredential
import json
import os

# Configuración de Azure Cognitive Search
endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
index_name = "tickets-hr"
api_key = os.getenv("AZURE_SEARCH_API_KEY")

# Inicializar el cliente
client = SearchClient(endpoint=endpoint,
                     index_name=index_name,
                     credential=AzureKeyCredential(api_key))

# Cargar los documentos desde el archivo JSON
with open("data_clean.json", "r", encoding="utf-8") as f:
    docs = json.load(f)

# Si el campo 'id' es numérico, conviértelo a string para que coincida con el índice
for doc in docs:
    doc["id"] = str(doc["id"])

# Subir los documentos al índice
result = client.upload_documents(documents=docs)
print("Resultado de la carga:")
for i, res in enumerate(result):
    print(f"Documento {i}: éxito={res.succeeded}, clave={res.key}, error={res.error_message}")
