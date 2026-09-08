# G&M Imports — E-commerce

Base de e-commerce em **Next.js + TypeScript + Supabase**, criada para a G&M Imports.

## O que já existe

- Home premium e responsiva
- Catálogo de Body Splashes
- Busca e filtros por família olfativa e vibe
- Favoritos em interface
- Carrinho em interface
- Estrutura para G&M Fragrance Finder
- Catálogo tipado em TypeScript
- Supabase preparado para autenticação, produtos, favoritos e pedidos
- SQL inicial com RLS
- Estrutura de painel administrativo em `/admin`
- API de checkout em `/api/checkout`
- Variáveis de ambiente em `.env.example`
- Estrutura preparada para Mercado Pago

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Configuração do Supabase

1. Crie um projeto no Supabase.
2. Execute `supabase/schema.sql` no SQL Editor.
3. Copie `.env.example` para `.env.local`.
4. Preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MERCADO_PAGO_ACCESS_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Nunca envie `.env.local` ou chaves privadas para o GitHub.

## Produtos e imagens reais

O catálogo inicial contém nomes reais de fragrâncias apenas como referência de desenvolvimento. O campo `image` está vazio de propósito. Use somente fotos próprias da G&M Imports, fotos fornecidas pelo fornecedor com autorização comercial ou imagens oficiais cujo uso tenha sido autorizado.

## Banco de dados

O schema inclui:

- `products`
- `profiles`
- `orders`
- `order_items`
- `favorites`

Também há políticas iniciais de Row Level Security.

## Próximas integrações

Para operação comercial ainda é necessário configurar serviços externos reais:

- Supabase Auth e Storage
- Mercado Pago/Pix
- cálculo de frete por CEP/transportadora
- webhooks de pagamento
- painel admin conectado ao banco
- upload de fotos
- controle transacional de estoque
- e-mail transacional
- WhatsApp
- Meta Pixel / GA4 / GTM
- domínio e deploy

## Aviso de marca

A G&M Imports é uma loja independente. Victoria's Secret e demais marcas citadas pertencem aos respectivos titulares. O projeto não replica a identidade oficial dessas marcas.
