USE helper_ia_db;
GO

-- Actualiza la ruta con la ubicación real del CSV antes de ejecutar.
-- Ejemplo en Windows:
-- BULK INSERT tickets_dataset
-- FROM 'C:\\data\\tickets_dataset.csv'

BULK INSERT tickets_dataset
FROM 'C:\\ruta\\a\\tus\\datos\\tickets_dataset.csv'
WITH (
    FORMAT = 'CSV',
    FIRSTROW = 2,
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '0x0a',
    TABLOCK
);

PRINT 'Dataset de tickets cargado correctamente';

