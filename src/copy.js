// @label: Copy element text
// @desc: Позволяет скопировать текст любого элемента по клику
// @icon: copy_element_text.svg

(function() {
    const r = document.documentElement;
    const s = document.createElement("style");
    s.innerHTML = "* { cursor: crosshair !important; }";
    r.appendChild(s);

    const showToast = function(text, x, y, isError) {
        const d = document.createElement("div");
        d.innerText = text;
        d.style.cssText = "position:fixed;left:" + (x + 15) + "px;top:" + (y + 15) + "px;background:" + (isError ? "#d32f2f" : "#333") + ";color:#fff;padding:6px 20px;border-radius:4px;z-index:2147483647;font-family:sans-serif;font-size:13px;box-shadow:0 4px 10px rgba(0,0,0,0.5);pointer-events:none;opacity:0;transition:opacity 0.2s ease;max-width:300px;word-wrap:break-word;display:block!important;visibility:visible!important;";
        r.appendChild(d);
        requestAnimationFrame(() => d.style.opacity = "1");
        setTimeout(() => {
            d.style.opacity = "0";
            setTimeout(() => d.remove(), 300);
        }, 2000);
    };

    const h = function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        let t = e.target.innerText || e.target.textContent || "";
        t = t.trim();
        const x = e.clientX;
        const y = e.clientY;
        if (t) {
            navigator.clipboard.writeText(t).then(() => {
                let preview = t.length > 30 ? t.substring(0, 30) + "..." : t;
                showToast("Скопировано: " + preview, x, y, false);
            }).catch(err => showToast("Ошибка буфера", x, y, true));
        } else {
            showToast("Текст не найден", x, y, true);
        }
        document.removeEventListener("click", h, true);
        s.remove();
    };
    document.addEventListener("click", h, true);
})();