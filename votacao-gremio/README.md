# Sistema de Votação do Grêmio

Versão centralizada para deploy na Vercel.

- Votos em PostgreSQL (Neon), não em localStorage.
- O mesmo RA fica bloqueado em qualquer aparelho.
- O RA não é salvo em texto puro: somente HMAC SHA-256.
- A senha administrativa fica em variável de ambiente, não no HTML.

## Variáveis obrigatórias

- `DATABASE_URL`
- `RA_HASH_SECRET` (mínimo 16 caracteres)
- `ADMIN_PASSWORD`
- `ADMIN_USER` (opcional; padrão `admin`)

Na Vercel, use `votacao-gremio` como **Root Directory**. A tabela é criada automaticamente no primeiro uso.

Observação: o sistema impede RA repetido, mas ainda não valida se o RA realmente pertence a um aluno da escola.
