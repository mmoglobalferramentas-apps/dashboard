//path, parece ser um código responsável por dar o attributo de rota ao código. Enquanto
// fileUrl to path parece ser um código responsável por mapear a rota de cada arquivo
import path from "node:path"
import { fileURLToPath } from "node:url"

// Flat compact com certeza parece ser algo relacionado a compactar algo.
import { FlatCompat } from "@eslint/eslintrc"

// define config, define a configuração do eslint, e globalIgonres 
// é responsável por ignorar algo-globalmente.
import { defineConfig, globalIgnores } from "eslint/config"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({ baseDirectory: __dirname })

export default defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  globalIgnores([
    ".next/**",
    ".wrangler/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
])

