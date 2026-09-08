import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.items?.length) return NextResponse.json({ error: 'Carrinho vazio.' }, { status: 400 });

  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    return NextResponse.json({
      mode: 'demo',
      message: 'Checkout preparado. Configure MERCADO_PAGO_ACCESS_TOKEN para criar pagamentos reais.',
      items: body.items
    });
  }

  return NextResponse.json({
    mode: 'configured',
    message: 'Token encontrado. Implemente aqui a criação da preferência/ordem do Mercado Pago usando apenas valores validados no servidor.'
  });
}
