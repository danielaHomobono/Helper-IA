# Transformación y unificación de datasets HR — Hackathon Microsoft

Este notebook procesa y unifica dos archivos JSON de tickets de RR.HH., desanida la estructura de entidades y genera un dataset final listo para análisis y uso en modelos o Azure Functions.

## Origen de los datos
Los datos utilizados provienen del repositorio público:  
**SAP / hr-request-data-set**  
https://github.com/SAP/hr-request-data-set

En particular, se emplean los archivos:
- `data.json`
- `data_new.json`

Ambos forman parte del dataset de tickets simulados de Recursos Humanos, con campos como `ticket`, `category`, `sub_category`, `entities` y `label`.

## Transformaciones aplicadas
Este notebook realiza las siguientes operaciones:

1. **Carga de ambos archivos JSON**  
   Se leen los datasets originales con `pandas.read_json`.

2. **Unificación de datasets**  
   Se concatenan filas para formar un único DataFrame ampliado.

3. **Desanidado de la columna `entities`**  
   - Se usa `explode()` para convertir cada lista de entidades en filas independientes.  
   - Se extraen los elementos `[start, end, label]` en columnas:  
     `entity_start`, `entity_end`, `entity_label`.

4. **Limpieza**  
   - Se eliminan duplicados.  
   - Se reordenan columnas para obtener una estructura limpia y plana.

5. **Exportación final**  
   El dataset transformado se exporta como archivo CSV para facilitar su uso en análisis, modelos de lenguaje o como entrada para una Azure Function dentro del proyecto del hackathon.

## Propósito del notebook
Este notebook forma parte del flujo de preparación de datos para el proyecto **Auto-resolve Service Desk**, dentro de la hackathon de Microsoft.  
Tiene como objetivo dejar un dataset estructurado que pueda alimentar un asistente inteligente de RR.HH. encargado de interpretar y gestionar tickets.

## Nota
Este notebook no modifica los archivos originales del repositorio; únicamente genera una versión procesada apta para entrenamiento y prototipado. 

---

## Exploración (`EDA_data_clean.ipynb`)

Notebook importado desde [fermuba/Helper-IA](https://github.com/fermuba/Helper-IA/blob/main/notebooks/EDA_data_clean.ipynb) para documentar la exploración de `data/data_clean.csv`. Genera métricas en español no técnico y gráficos listos para dashboards de Azure.

### Dependencias

- Python 3.9+
- `pandas`, `matplotlib`, `seaborn`, `notebook`

Se recomienda usar el entorno virtual del repo:

```powershell
python -m venv .venv
.\.venv\Scripts\activate
pip install pandas matplotlib seaborn notebook
```

### Ejecución

```powershell
jupyter notebook notebooks/EDA_data_clean.ipynb
```

El notebook detecta la ruta del proyecto automáticamente, por lo que puede correrse desde VS Code, nbconvert o Colab. Lee `data/data_clean.csv` y escribe todos los artefactos en `outputs/`:

- `metadata.json`
- `category_distribution.png`
- `sub_category_distribution.png`
- `ticket_len_histogram.png`
- `ticket_len_boxplot.png`
- `top_10_entities_distribution.png`
- `category_entity_cooccurrence_heatmap.png`

