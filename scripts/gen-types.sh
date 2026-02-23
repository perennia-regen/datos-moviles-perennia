#!/bin/bash
# Genera tipos TypeScript desde Supabase (schemas public + datos_campo)
# Uso: ./scripts/gen-types.sh

set -e

PROJECT_ID="fkrppgqtlgoxnonohenu"
OUTPUT="perennia-app/types/database.ts"

echo "Generando tipos para schemas public + datos_campo..."
npx supabase gen types --project-id "$PROJECT_ID" --schema public --schema datos_campo 2>/dev/null > "$OUTPUT"

LINES=$(wc -l < "$OUTPUT")
echo "Tipos generados: $OUTPUT ($LINES líneas)"
