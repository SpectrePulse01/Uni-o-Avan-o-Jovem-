# União Avanço Jovem — U.A.J.

Site da chapa União Avanço Jovem, com 20 propostas e 17 perfis com avatares personalizados, incluindo a gestão escolar.

**Site:** https://spectrepulse01.github.io/Uni-o-Avan-o-Jovem-/

## Desenvolvimento

Requer Node.js 22 ou superior.

```sh
npm ci
npm run dev
```

## Publicação

O GitHub Pages publica a pasta `docs` da branch `main`. Após editar o código:

```sh
npm run build:pages
```

Envie o código e a pasta `docs` atualizada ao GitHub. O endereço permanece o mesmo.

Para Vercel: framework Vite, comando `npm run build`, diretório de saída `dist`.

## Recursos

- Seis seções com transições, animação 3D e alternativa sem WebGL.
- Propostas detalhadas, organizadas por facilidade estimada de execução.
- Navegação das propostas e membros pelas teclas esquerda/direita e gestos no celular.
- Vídeos responsivos da bandeira e avatares com transparência.

As áreas de envio de ideias, reclamações e acompanhamento estão descritas como propostas; esta versão apresenta a chapa e seu programa.

Tecnologias: React, TypeScript, Vite, Motion, Three.js e GSAP.
