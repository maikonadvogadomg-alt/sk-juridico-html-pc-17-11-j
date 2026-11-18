/* Meu Chat — 14-entrada.js · 🔑 TELA DE LOGIN NA ENTRADA (17/11)
   Igual à Replit: abriu o Meu Chat em qualquer lugar (celular, PC, PWA, APK) → e-mail + senha →
   as conversas, a memória, os códigos guardados E as chaves de IA aparecem. Ninguém cola endereço.
   Só aparece quando o Supabase vem EMBUTIDO (js/nuvem-embutida.js) e você ainda não entrou aqui.
   Dentro do SK Jurídico/Laboratório ela não aparece (lá quem cuida do login é o app de fora). */
(function (MC) {
  'use strict';
  function dentroDeOutroApp() { try { return window.parent !== window; } catch (e) { return true; } }
  function precisa() {
    const N = MC.nuvem; if (!N || !N.temEmb() || dentroDeOutroApp()) return false;
    if (N.sessao()) return false;
    if (N.ehNeon() && N.logado()) return false;
    return !MC.pref.get('entrada:pular', false);
  }
  function mostrar() {
    if (MC.$('#entrada-login')) return;
    const w = document.createElement('div');
    w.id = 'entrada-login'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', 'Entrar no Meu Chat');
    w.innerHTML = '<div class="ent-caixa"><div class="ent-logo">💬</div><h1>Meu Chat</h1>' +
      '<p class="ent-sub">Entre para ter as suas conversas, a memória e as suas chaves em qualquer aparelho.</p>' +
      '<label class="ent-rot" for="ent-email">E-mail</label><input id="ent-email" type="email" autocomplete="username" inputmode="email" placeholder="seu@email.com">' +
      '<label class="ent-rot" for="ent-senha">Senha</label><div class="ent-senha"><input id="ent-senha" type="password" autocomplete="current-password" placeholder="mínimo 6"><button type="button" class="ent-olho" data-e="olho" aria-label="Mostrar a senha">👁</button></div>' +
      '<button class="bt primario ent-bt" data-e="entrar">🔑 Entrar</button><button class="bt ent-bt" data-e="criar">✨ Criar conta (1ª vez)</button>' +
      '<p id="ent-msg" class="ent-msg" role="status"></p>' +
      '<div class="ent-rodape"><button class="ent-link" data-e="esqueci">Esqueci a senha</button><button class="ent-link" data-e="pular">Usar só neste aparelho, sem login</button></div></div>';
    document.body.appendChild(w);
    const msg = (t, ruim) => { const m = MC.$('#ent-msg'); m.textContent = t; m.className = 'ent-msg' + (ruim ? ' ruim' : ''); };
    setTimeout(() => { try { MC.$('#ent-email').focus(); } catch (e) {} }, 100);
    w.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'ent-senha') w.querySelector('[data-e="entrar"]').click(); });
    w.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-e]'); if (!b) return; const a = b.dataset.e;
      if (a === 'olho') { const s = MC.$('#ent-senha'); s.type = s.type === 'password' ? 'text' : 'password'; return; }
      if (a === 'pular') { MC.pref.set('entrada:pular', true); w.remove(); MC.aviso('Tudo fica só neste aparelho. Para entrar depois: ⚙️ → ☁️ Nuvem.'); return; }
      const bts = [...w.querySelectorAll('button')]; bts.forEach((x) => { x.disabled = true; });
      try {
        const email = MC.$('#ent-email').value, senha = MC.$('#ent-senha').value;
        if (a === 'esqueci') { await MC.nuvem.esqueci(email); msg('📧 Mandei um e-mail para trocar a senha. Abra o e-mail e siga o link.'); return; }
        msg(a === 'criar' ? '⏳ Criando a sua conta…' : '⏳ Entrando…');
        const r = await MC.nuvem.entrar(email, senha, a === 'criar');
        if (r.confirmar) { msg('📧 Conta criada! Abra o e-mail do Supabase, toque no link de confirmação, volte aqui e toque em 🔑 Entrar.'); return; }
        msg('✅ Entrou! Trazendo as suas coisas…');
        try { const s = await MC.nuvem.sincronizar(true); MC.aviso('☁️ Pronto: ' + s.desceu + ' item(ns) chegaram, ' + s.subiu + ' foram daqui.' + (r.chaves ? ' ' + r.chaves : ''), 'ok'); }
        catch (err) { MC.aviso('Entrou, mas a nuvem respondeu: ' + err.message, 'erro'); }
        w.remove();
      } catch (err) { msg('⚠ ' + err.message, true); }
      finally { bts.forEach((x) => { x.disabled = false; }); }
    });
  }
  document.addEventListener('DOMContentLoaded', () => setTimeout(() => { if (precisa()) mostrar(); }, 50));
  MC.entrada = { mostrar, precisa };
})(window.MC);
