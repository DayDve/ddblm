// @label: Safe select
// @desc: Отключает ссылки, позволяя выделять текст на них
// @icon: select_mode.svg

(function() {
    if (window._safeSelectMode) {
        window._safeSelectMode.exit();
        window._safeSelectMode = null;
        return;
    }

    const showNotif = (title, color, text) => {
        let d = document.createElement('div');
        d.style.cssText = 'position:fixed;top:15px;left:15px;z-index:2147483647;background:rgba(30,30,30,0.95);color:#fff;padding:15px;border-radius:6px;font-family:monospace;font-size:13px;box-shadow:0 4px 15px rgba(0,0,0,0.5);border:1px solid #444;text-align:left;cursor:pointer;min-width:180px;';
        d.innerHTML = `<div style="color:${color};font-weight:bold;margin-bottom:5px;">${title}</div><div>${text}</div>`;
        document.body.appendChild(d);
        const remove = () => {
            d.style.transition = "opacity 0.5s";
            d.style.opacity = "0";
            setTimeout(() => {
                if (d.parentElement) d.remove();
            }, 500);
        };
        setTimeout(remove, 2000);
        d.onclick = remove;
    };

    const indicator = document.createElement('div');
    indicator.innerHTML = '<div>● SAFE SELECT</div><div style="font-size:9px;font-weight:normal;opacity:0.8;margin-top:2px;">(Жми закладку для выхода)</div>';
    indicator.style.cssText = 'position:fixed;top:60px;right:10px;z-index:2147483646;background:#d00;color:#fff;padding:6px 10px;border-radius:4px;font-family:sans-serif;font-size:11px;font-weight:bold;box-shadow:0 2px 5px rgba(0,0,0,0.3);letter-spacing:0.5px;cursor:help;transition:opacity 0.3s;text-align:right;';
    indicator.onmouseenter = () => indicator.style.opacity = '0';
    indicator.onmouseleave = () => indicator.style.opacity = '1';
    document.documentElement.appendChild(indicator);

    const s = document.createElement("style");
    s.innerHTML = "*{cursor:text!important;user-select:text!important;-webkit-user-select:text!important;-webkit-user-drag:none!important;user-drag:none!important}.safe-select-active{text-decoration:underline dotted red!important;color:inherit!important;cursor:text!important;}";
    document.documentElement.appendChild(s);

    const kill = e => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    };

    const neutralize = () => {
        document.querySelectorAll("a[href]").forEach(a => {
            a.setAttribute("data-href-backup", a.getAttribute("href"));
            a.removeAttribute("href");
            a.classList.add("safe-select-active");
        });
        document.querySelectorAll('[draggable="true"]').forEach(el => {
            el.setAttribute("data-drag-backup", "true");
            el.setAttribute("draggable", "false");
        });
    };

    const restore = () => {
        document.querySelectorAll("a[data-href-backup]").forEach(a => {
            a.setAttribute("href", a.getAttribute("data-href-backup"));
            a.removeAttribute("data-href-backup");
            a.classList.remove("safe-select-active");
        });
        document.querySelectorAll('[data-drag-backup]').forEach(el => {
            el.setAttribute("draggable", "true");
            el.removeAttribute("data-drag-backup");
        });
    };

    const obs = new MutationObserver(neutralize);
    obs.observe(document.body, {
        childList: true,
        subtree: true
    });
    neutralize();
    document.addEventListener("click", kill, true);
    showNotif('🛡️ Safe Select: ON', '#4f9', 'Ссылки отключены.<br>Можно выделять текст.');

    window._safeSelectMode = {
        exit: () => {
            restore();
            document.removeEventListener("click", kill, true);
            obs.disconnect();
            s.remove();
            indicator.remove();
            showNotif('🔓 Safe Select: OFF', '#f55', 'Ссылки снова<br>активны.');
        }
    };
})();