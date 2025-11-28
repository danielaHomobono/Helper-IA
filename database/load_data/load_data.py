import pandas as pd
import pyodbc
import numpy as np

# ===============================
# 1) Configurar conexión
# ===============================
server = 'dbserverequipo6hackaton2025.database.windows.net'
database = 'dbequipo6hackaton2025'
username = 'username'
password = 'password'  # <-- reemplazar

conn = pyodbc.connect(
    f'DRIVER={{ODBC Driver 18 for SQL Server}};'
    f'SERVER={server};DATABASE={database};UID={username};PWD={password};'
    'Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;'
)
cursor = conn.cursor()

# ===============================
# 2) Cargar CSV
# ===============================
df = pd.read_csv("/home/fermuba/Programs/Helper-IA/data/data_clean.csv")

# Reemplazar NaN con None para SQL
df = df.replace({np.nan: None})

# ===============================
# 3) Insertar datos en Tickets
# ===============================

tickets_df = df.groupby("id").agg({
    "ticket": "first",
    "category": "first",
    "sub_category": "first",
    "label": "first"
}).reset_index()

# --- Insertar Tickets ---
for _, row in tickets_df.iterrows():
    cursor.execute("""
        INSERT INTO Tickets (ticket_id, ticket_text, category, sub_category, label, status, user_feedback, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, GETDATE())
    """, row["id"], row["ticket"], row["category"], row["sub_category"], row["label"], None, None)

conn.commit()

# --- Insertar Entities ---
for _, row in df.iterrows():
    full_text = row["ticket"]
    start = int(row["entity_start"])
    end = int(row["entity_end"])

    entity_text = full_text[start:end]

    cursor.execute("""
        INSERT INTO TicketEntities (ticket_id, entity_label, entity_start, entity_end, entity_text)
        VALUES (?, ?, ?, ?, ?)
    """, row["id"], row["entity_label"], start, end, entity_text)

conn.commit()

cursor.close()
conn.close()

print("Carga completada exitosamente.")