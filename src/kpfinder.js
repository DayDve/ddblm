// @label: KPFinder
// @desc: Поиск и просмотр фильмов с Кинопоиска
// @icon: kinopoisk-film.svg
// @token: __KP_TOKEN__
// @token-desc: API-ключ для Kinopoisk Api Unofficial
// @token-link: https://kinopoiskapiunofficial.tech/

(function() {
    const D = document, L = location, W = window, H = L.href, E = encodeURIComponent;

    const w = l => {
        /^(https?|file):/i.test(H) ? W.open(l, '_blank') : L.href = l;
    };

    if (/^https:\/\/www\.kinopoisk\.ru\/(film|series)\//.test(H)) {
        w(H.replace('kinopoisk.ru', 'kinokino.vip'));
        return;
    }

    const K = '__KP_TOKEN__';

    const el = (t, s, x, p) => {
        let e = D.createElement(t);
        if (s) e.style.cssText = s;
        if (x) e.textContent = x;
        if (p) p.appendChild(e);
        return e;
    };

    let o = D.getElementById('kp-bm');
    if (o) o.remove();

    o = el('div', 'all:initial;position:fixed;inset:0;z-index:2147483647');
    o.id = 'kp-bm';
    (D.body || D.documentElement).appendChild(o);

    let sr = o.attachShadow({ mode: 'open' });

    const DF = 'display:flex',
          AIC = 'align-items:center',
          C = '#fff',
          BG = 'background:',
          BR = 'border-radius:',
          P = 'padding:',
          CP = 'cursor:pointer',
          FWB = 'font-weight:bold';

    let ov = el('div',
        `position:absolute;inset:0;${BG}rgba(0,0,0,.9);${DF};justify-content:center;${AIC};font-family:sans-serif`,
        '', sr);

    let m = el('div',
        `${BG}#1a1a1a;${P}20px;${BR}10px;width:400px;${DF};flex-direction:column;gap:10px;color:${C};box-sizing:border-box;box-shadow:0 10px 30px #000`,
        '', ov);

    let h = el('div', `${DF};${AIC};gap:10px;margin-bottom:5px`, '', m);
    let img = el('img', 'width:24px;height:24px', '', h);
    img.src = 'data:image/gif;base64,R0lGODlhGAAYAOMLAP////+ZM/+ZAP9mAP/Mmf/MzP/MZv+ZZv/MM/9mM///zBchKxchKxchKxchKxchKyH5BAEKAA8ALAAAAAAYABgAAATfUAQh6az4aosCEl0YGOInUtU0GQXgAoURqOhcU2/uxum96kCAJUMZKAAETwugmBGYm5TBNRu5DiqXjKZaTgZTwDbgUgxpL8WBRXiOloCBamABEihPXYBekdvleTk2A3QTaTNIT2twexKNA0sHhVQCfkx0hXwHVBObADZkAJJ7jxMtSQFLBU4wEph7cnRBepWYdAQFlQJwOrmET4QJAZuoYLwxcohJhKGqBFhVB7g6tQPLToEvbbDW3DABbdptcG3SAAmEYDtJAgnu6QPSeQTwwPD36e9I6Onc/fjpsBCKAAA7';
    el('span', `${FWB};font-size:16px;color:#f60`, 'KPFinder', h);

    let i = el('input',
        `${P}10px;border:1px solid #555;${BG}#111;color:${C};${BR}6px;outline:none;font-size:14px;box-sizing:border-box`,
        '', m);
    i.placeholder = 'Поиск...';

    let d2 = el('div', `${DF};gap:10px`, '', m);
    let b = el('button',
        `flex:1;${P}10px;${BG}#f60;color:${C};border:none;${BR}6px;${CP};${FWB}`,
        'Поиск', d2);
    let c = el('button',
        `flex:1;${P}10px;${BG}#444;color:${C};border:none;${BR}6px;${CP};${FWB}`,
        'Отмена', d2);

    let r = el('div',
        `max-height:300px;overflow-y:auto;${DF};flex-direction:column;gap:5px;margin-top:10px`,
        '', m);

    let arr = [];
    const x = () => o.remove();
    const u = f => {
        w('https://www.kinokino.vip/' + (f.type === 'TV_SERIES' ? 'series' : 'film') + '/' + f.filmId + '/');
        x();
    };

    setTimeout(() => i.focus(), 50);
    c.onclick = x;
    ov.onmousedown = e => { if (e.target == ov) x(); };

    i.onkeydown = e => {
        if (e.key === 'Enter') b.click();
        if (e.key === 'Escape') x();
        if (e.key === 'ArrowDown' && arr.length) arr[0].focus();
    };

    b.onclick = () => {
        const q = i.value.trim();
        if (!q) return;
        r.textContent = '';
        el('div', 'text-align:center;color:#aaa', 'Ищем...', r);
        arr = [];

        fetch('https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=' + E(q), {
            headers: {
                'accept': 'application/json',
                'X-API-KEY': K
            }
        })
        .then(res => res.json())
        .then(d => {
            r.textContent = '';
            if (!d.films || !d.films.length) {
                el('div', 'text-align:center;color:#aaa', 'Не найдено', r);
                return;
            }
            d.films.forEach((f, idx) => {
                let t = el('div',
                    `${DF};${AIC};gap:10px;${P}8px;${BG}#222;${BR}4px;${CP};outline:none;border:1px solid transparent;color:${C};text-align:left`,
                    '', r);
                t.tabIndex = 0;
                t.onfocus = () => t.style.borderColor = '#f60';
                t.onblur = () => t.style.borderColor = 'transparent';

                let img2 = el('img',
                    `width:30px;height:45px;${BR}2px;${BG}#111;flex-shrink:0`,
                    '', t);
                img2.src = f.posterUrlPreview || '';

                let d3 = el('div', 'font-size:13px;overflow:hidden', '', t);
                el('div', 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
                    f.nameRu || f.nameEn || '?', d3);
                el('span', 'color:#888', f.year || '', d3);

                t.onclick = () => u(f);
                t.onkeydown = e => {
                    if (e.key === 'Enter') u(f);
                    if (e.key === 'ArrowDown' && arr[idx + 1]) arr[idx + 1].focus();
                    if (e.key === 'ArrowUp') idx > 0 ? arr[idx - 1].focus() : i.focus();
                    if (e.key === 'Escape') x();
                };
                arr.push(t);
            });
            if (arr.length) arr[0].focus();
        })
        .catch(() => {
            r.textContent = '';
            let t = el('div',
                `${DF};${AIC};justify-content:center;${P}15px;${BG}#f55;${BR}4px;${CP};color:${C};${FWB};outline:none`,
                '⚠️ Искать на Кинопоиске', r);
            t.tabIndex = 0;
            t.onclick = () => {
                w('https://www.kinopoisk.ru/index.php?kp_query=' + E(q));
                x();
            };
            t.onkeydown = e => {
                if (e.key === 'Enter') t.onclick();
                if (e.key === 'Escape') x();
            };
            t.focus();
        });
    };
})();
