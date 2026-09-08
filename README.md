# G&M Imports — E-commerce

Base de e-commerce em **Next.js + TypeScript + Supabase**, criada para a G&M Imports.

## O que já existe

- Home premium e responsiva
- Catálogo conectado ao Supabase
- Busca e filtros por família olfativa e vibe
- Favoritos em interface
- Carrinho em interface
- Estrutura para G&M Fragrance Finder
- Supabase preparado para autenticação, produtos, favoritos e pedidos
- SQL com RLS
- Painel administrativo funcional em `/admin`
- Cadastro, edição e exclusão de produtos
- Controle de preço, estoque, SKU, volume, família olfativa, notas, vibe e ocasião
- Upload de imagem principal para Supabase Storage
- Publicação automática de produtos ativos no catálogo da home
- API protegida para operações administrativas
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

## Criando a primeira administradora

1. No Supabase, abra **Authentication > Users** e crie a usuária administrativa.
2. Execute no SQL Editor, substituindo o e-mail pelo e-mail utilizado:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'SEU_EMAIL_AQUI'
);
```

3. Abra `/admin` no site e entre com esse e-mail e senha.

## Painel administrativo

No `/admin` é possível:

- cadastrar novos produtos
- editar produtos existentes
- excluir produtos
- controlar estoque
- cadastrar preço normal e promocional
- informar SKU e volume
- cadastrar família olfativa
- cadastrar notas de saída, coração e fundo
- informar vibe e ocasiões
- ajustar doçura, intensidade e frescor
- marcar produto como ativo, novidade ou destaque
- enviar foto real do produto

Produtos marcados como **ativos** aparecem automaticamente no catálogo da home quando o Supabase estiver conectado.

## Imagens reais

O bucket `product-images` é criado pelo `supabase/schema.sql`. Use somente fotos próprias da G&M Imports, fotos fornecidas por fornecedores com autorização comercial ou imagens oficiais cujo uso tenha sido autorizado.

## Banco de dados

O schema inclui:

- `products`
- `profiles`
- `orders`
- `order_items`
- `favorites`
- bucket público `product-images`

Também há políticas iniciais de Row Level Security. As gravações administrativas passam por rotas protegidas no servidor e usam a service role somente após confirmar que o usuário autenticado possui `role = admin`.

## Próximas integrações

Para operação comercial completa ainda é necessário configurar:

- Mercado Pago/Pix real
- cálculo de frete por CEP/transportadora
- webhooks de pagamento
- baixa transacional de estoque após pagamento
- histórico de pedidos no painel
- cupons
- e-mail transacional
- WhatsApp
- Meta Pixel / GA4 / GTM
- domínio e deploy

## Aviso de marca

A G&M Imports é uma loja independente. Victoria's Secret e demais marcas citadas pertencem aos respectivos titulares. O projeto não replica a identidade oficial dessas marcas.
