// @label: QR
// @desc: Генерирует QR-код для текущей страницы
// @icon: QRcode.svg

(async function() {
  /* 1. ЧИСТИМ СТАРЫЙ ОВЕРЛЕЙ */
  let old = document.getElementById('qr-shortener-box');
  if (old) old.remove();

  /* 2. СОЗДАЕМ ОВЕРЛЕЙ */
  let d = document.createElement('div');
  d.id = 'qr-shortener-box';
  d.style.cssText = 'position:fixed;top:15px;left:15px;z-index:2147483647;background:rgba(30,30,30,0.95);color:#fff;padding:15px;border-radius:6px;font-family:monospace;font-size:13px;box-shadow:0 4px 15px rgba(0,0,0,0.5);text-align:center;cursor:pointer;border:1px solid #444;min-width:160px;';
  d.innerHTML = '<div style="color:#aaa">Checking...</div>';
  document.body.appendChild(d);

  setTimeout(() => {
    document.addEventListener('click', function h(e) {
      if (!d.contains(e.target)) {
        d.remove();
        document.removeEventListener('click', h);
      }
    });
  }, 200);

  /* === FALLBACK: ОТКРЫВАЕМ ЧИСТОЕ ОКНО === */
  const runFallback = () => {
    d.style.borderColor = '#f55';
    d.innerHTML = '<div style="color:#f55;margin-bottom:5px">⚠️ CSP Block</div><div style="font-size:10px;color:#aaa">Opening Window...</div>';
    
    setTimeout(() => {
      let qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=' + encodeURIComponent(window.location.href);
      
      /* ПАРАМЕТРЫ ДЛЯ ЧИСТОГО ОКНА */
      let params = 'width=300,height=300,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no';
      params += ',left=' + (screen.width/2-150) + ',top=' + (screen.height/2-150);
      
      window.open(qrUrl, 'qr_fallback', params);
      d.remove();
    }, 1000);
  };

  const render = (s) => {
    d.innerHTML = `<div style="margin-bottom:10px;font-size:11px;color:#aaa;">Copy URL</div><div id="qr-placeholder" style="width:150px;height:150px;line-height:150px;background:#444;border-radius:4px;margin:0 auto;color:#888;font-size:10px;">QR...</div>`;
    
    d.onclick = () => {
      navigator.clipboard.writeText(s).then(() => {
        d.innerHTML = '<div style="padding:40px 10px;color:#4f9;">Copied!<br>🚀</div>';
        setTimeout(() => d.remove(), 800);
      });
    };

    const q = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(s)}&bgcolor=ffffff`;
    const i = new Image();
    i.src = q;
    i.style.cssText = "display:block;margin:0 auto;border-radius:4px;width:150px;height:150px;";
    i.onerror = runFallback;
    i.onload = function() {
      const ph = document.getElementById('qr-placeholder');
      if (ph) ph.replaceWith(i);
    };
  };

  try {
    const u = window.location.href;
    const k = 'bk_shrt_' + u;
    let s = localStorage.getItem(k);

    if (s) {
      render(s);
    } else {
      d.innerHTML = '<div style="color:#aaa">Shortening...</div>';
      /* Используем прокси allorigins для is.gd */
      const a = 'https://is.gd/create.php?format=simple&url=' + encodeURIComponent(u);
      const r = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(a));
      
      if (!r.ok) throw new Error('ProxyErr');
      s = await r.text();
      
      if (!s.startsWith('http')) throw new Error('IsgdErr');
      localStorage.setItem(k, s);
      render(s);
    }
  } catch (e) {
    runFallback();
  }
})();
