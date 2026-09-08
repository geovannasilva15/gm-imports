export default function AdminPage() {
  return (
    <main style={{padding:'48px',fontFamily:'Arial,Helvetica,sans-serif',color:'#50494c'}}>
      <p style={{letterSpacing:'.16em',textTransform:'uppercase',fontSize:12,color:'#9b767e'}}>G&M Imports</p>
      <h1 style={{fontFamily:'Georgia,serif',fontSize:48,fontWeight:500}}>Painel administrativo</h1>
      <p>Estrutura preparada para conectar autenticação do Supabase e liberar esta área apenas para perfis com role <b>admin</b>.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,marginTop:32}}>
        {['Produtos','Estoque','Pedidos','Clientes','Cupons','Banners','Relatórios'].map((item)=><section key={item} style={{border:'1px solid #eee7e9',borderRadius:18,padding:24,background:'#fff'}}><h2 style={{fontFamily:'Georgia,serif',fontWeight:500}}>{item}</h2><p>Módulo pronto para integração com dados reais.</p></section>)}
      </div>
    </main>
  );
}
