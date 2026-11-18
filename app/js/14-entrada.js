/* =========================================================================
   SK Jurídico HTML — 14-entrada.js · 🔑 TELA DE LOGIN NA ENTRADA (17/11)
   Igual à Replit: abriu o app em qualquer aparelho (celular, PC, PWA, APK) →
   e-mail + senha → os seus processos aparecem. Ninguém cola endereço nenhum.
   Só aparece quando o Supabase vem EMBUTIDO (js/nuvem-embutida.js) e você
   ainda não entrou neste aparelho. O 🐘 Neon continua do mesmo jeito, por dentro.
   ========================================================================= */
(function (J) {
  'use strict';
  const E = J.esc;
  function precisa() {
    const N = J.nuvem; if (!N || !N.temEmb()) return false;
    if (N.sessao()) return false;                       // já entrou
    if (N.ehNeon() && N.logado()) return false;         // está usando o Neon
    return !J.pref.get('entrada:pular', false);         // escolheu "só neste aparelho"
  }
  function mostrar() {
    if (J.$('#entrada')) return;
    const w = document.createElement('div');
    w.id = 'entrada';
    w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', 'Entrar');
    w.innerHTML = '<div class="ent-caixa">' +
      '<div class="ent-logo">⚖️</div><h1>SK Jurídico</h1>' +
      '<p class="ent-sub">Entre para ter os seus processos em qualquer aparelho — celular, computador, onde for.</p>' +
      '<label class="ent-rot" for="ent-email">E-mail</label><input id="ent-email" type="email" autocomplete="username" inputmode="email" placeholder="seu@email.com">' +
      '<label class="ent-rot" for="ent-senha">Senha</label><div class="ent-senha"><input id="ent-senha" type="password" autocomplete="current-password" placeholder="mínimo 6"><button type="button" class="ent-olho" data-e="olho" aria-label="Mostrar a senha">👁</button></div>' +
      '<button class="bt forte ent-bt" data-e="entrar">🔑 Entrar</button>' +
      '<button class="bt ent-bt" data-e="criar">✨ Criar conta (1ª vez)</button>' +
      '<p id="ent-msg" class="ent-msg" role="status"></p>' +
      '<div class="ent-rodape"><button class="ent-link" data-e="esqueci">Esqueci a senha</button><button class="ent-link" data-e="pular">Usar só neste aparelho, sem login</button></div>' +
      '</div>';
    document.body.appendChild(w);
    const msg = (t, ruim) => { const m = J.$('#ent-msg'); m.textContent = t; m.className = 'ent-msg' + (ruim ? ' ruim' : ''); };
    const campos = () => [J.$('#ent-email').value, J.$('#ent-senha').value];
    setTimeout(() => { try { J.$('#ent-email').focus(); } catch (e) {} }, 100);
    w.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'ent-senha') { const b = w.querySelector('[data-e="entrar"]'); if (b) b.click(); } });
    w.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-e]'); if (!b) return;
      const a = b.dataset.e;
      if (a === 'olho') { const s = J.$('#ent-senha'); s.type = s.type === 'password' ? 'text' : 'password'; return; }
      if (a === 'pular') { J.pref.set('entrada:pular', true); w.remove(); J.aviso('Tudo fica só neste aparelho. Para entrar depois: ⚙️ Config → ☁️ Nuvem.', 'info', 6000); return; }
      const botoes = [...w.querySelectorAll('button')]; botoes.forEach((x) => { x.disabled = true; });
      try {
        if (a === 'esqueci') { await J.nuvem.esqueci(campos()[0]); msg('📧 Mandei um e-mail para trocar a senha. Abra o e-mail e siga o link.'); return; }
        msg(a === 'criar' ? '⏳ Criando a sua conta…' : '⏳ Entrando…');
        const [email, senha] = campos();
        const r = await J.nuvem.entrar(email, senha, a === 'criar');
        if (r.confirmar) { msg('📧 Conta criada! Abra o e-mail do Supabase, toque no link de confirmação e depois volte aqui e toque em 🔑 Entrar.'); return; }
        msg('✅ Entrou! Trazendo os seus processos…');
        try {
          const s = await J.nuvem.sincronizar(true);
          J.aviso('☁️ Pronto: ' + s.desceu + ' item(ns) chegaram da nuvem, ' + s.subiu + ' foram deste aparelho.', 'ok', 6000);
        } catch (err) { J.aviso('Entrou, mas a nuvem respondeu: ' + err.message, 'erro', 9000); }
        w.remove();
        if (J.nuvem.pintar) J.nuvem.pintar();
      } catch (err) { msg('⚠ ' + err.message, true); }
      finally { botoes.forEach((x) => { x.disabled = false; }); }
    });
  }
  document.addEventListener('DOMContentLoaded', () => { if (precisa()) mostrar(); });
  J.entrada = { mostrar, precisa };
})(window.J);
