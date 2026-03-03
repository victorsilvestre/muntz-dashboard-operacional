import pandas as pd
import sys

file_path = r"g:\Meu Drive\Muntz\Dashboard Operacional\relatorio_tarefas-runrunit-2026.xlsx"
try:
    df = pd.read_excel(file_path)
    print("--- COLUMNS ---")
    for col in df.columns:
        print(f"- {col}")
    
    print("\n--- SHAPE ---")
    print(df.shape)
    
    print("\n--- DATA TYPES ---")
    print(df.dtypes)
except Exception as e:
    print(f"Error reading excel file: {e}")
