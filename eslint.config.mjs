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

//configuração do diretório. Adicione core-web-vitals, next/typescript, então
//dimencionaliza abaixo "globalIgnores", dizendo o que o diretório deve ignorar.
// o meu chute é que é basicamente a configuração do eslint.
// o eslint é um código que verifica as mas praticas do projeto. 
// aqui, ele definiu quais são as rotas ue ele vai verificar e quais não.
// as variáveis responsável. Sendo que ele será responsável por dirname + next/core e next/type
// ignorando o resto.
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

