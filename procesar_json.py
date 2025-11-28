import pandas as pd
import json

# Ruta local del archivo
ruta_json = "data_new.json"

def cargar_json(path):
    try:
        return pd.read_json(path)
    except ValueError:
        try:
            return pd.read_json(path, lines=True)
        except Exception:
            with open(path, "r", encoding="utf-8") as f:
                data = f.read()
            try:
                return pd.DataFrame(json.loads(data))
            except Exception:
                print(f"Error al leer el archivo {path}. Verifica el formato JSON.")
                exit(1)

# Leer data_new.json
df_final = cargar_json(ruta_json)

# Expandir entidades
df_expanded = df_final.explode("entities").reset_index(drop=True)
df_expanded_filtered = df_expanded[df_expanded['entities'].apply(lambda x: isinstance(x, list) or pd.isna(x))].copy()
df_expanded_filtered = df_expanded_filtered[df_expanded_filtered['entities'].notna()]
df_entities = pd.DataFrame(df_expanded_filtered["entities"].tolist(), columns=["entity_start", "entity_end", "entity_label"])
df_final_clean = pd.concat([df_expanded_filtered.drop(columns=["entities"]), df_entities], axis=1)
df_final_clean = df_final_clean[["id", "ticket", "category", "sub_category", "entity_start", "entity_end", "entity_label", "label"]]
df_final_clean['entity_start'] = df_final_clean['entity_start'].astype('Int64')
df_final_clean['entity_end'] = df_final_clean['entity_end'].astype('Int64')
df_final_clean['id'] = df_final_clean['id'].astype('Int64')
df_final_clean = df_final_clean.drop_duplicates()
df_final_clean.dropna(inplace=True)
df_final_clean = df_final_clean.reset_index(drop=True)
# Depuración antes de exportar
print("Primeras filas del DataFrame limpio:")
print(df_final_clean.head())
print("\nColumnas del DataFrame limpio:")
print(df_final_clean.columns)
print(f"\nForma del DataFrame limpio: {df_final_clean.shape}")

# Exportar a JSON
output_path = "data_clean.json"
df_final_clean.to_json(output_path, orient="records", force_ascii=False)
print(f"Archivo generado: {output_path}")

