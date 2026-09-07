// @label: Search on DuckDuckGo
// @desc: Повторяет текущий поисковой запрос (google, yandex, etc) в DuckDuckGo 
// @icon: duckduckgo.svg

(function() {
    let old = document.getElementById('ddg-warn-box');
    if (old) old.remove();

    const params = new URLSearchParams(window.location.search);
    const keys = ['q', 'text', 'p', 'query', 'as_q', 'wd'];
    let searchTerms = null;
    
    for (let k of keys) {
        if (params.get(k)) {
            searchTerms = params.get(k);
            break;
        }
    }
    
    if (searchTerms) {
        window.location.href = 'https://duckduckgo.com/?q=' + encodeURIComponent(searchTerms);
    } else {
        let d = document.createElement('div');
        d.id = 'ddg-warn-box';
        d.style.cssText = '
		position:fixed;top:15px;
		left:15px;
		z-index:2147483647;
		background:rgba(30,30,30,0.95);
		color:#fff;
		padding:15px;
		border-radius:6px;
		font-family:monospace;
		font-size:13px;
		box-shadow:0 4px 15px rgba(0,0,0,0.5);
		border:1px solid #444;
		text-align:left;
		cursor:pointer;
	';

        d.innerHTML = '
		<div style="color:#f55;font-weight:bold;margin-bottom:5px;">Ошибка</div>
		<div>Это не страница поиска.<br>
		Параметры не найдены.</div>
	';
        document.body.appendChild(d);
        
        const remove = () => {
            d.style.transition = "opacity 0.5s";
            d.style.opacity = "0";
            setTimeout(() => {
                if (d.parentElement) d.remove();
            }, 500);
        };
        setTimeout(remove, 3000);
        d.onclick = remove;
    }
})();
