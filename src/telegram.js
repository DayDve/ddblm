// @label: Send to Telegram
// @desc: Отправляет ссылку или выделенный текст в Telegram
// @icon: tlg_share.svg

(function() {
    var delay = 5000;
    var bt3 = '```';
    var sel = window.getSelection().toString();
    var url, textPart = '';

    if (sel) {
        url = bt3;
        textPart = '&text=' + encodeURIComponent(sel + '\n') + bt3;
    } else {
        url = encodeURIComponent(window.location.href);
    }

    var tgUrl = 'https://t.me/share/url?url=' + url + textPart;

    var win = window.open('', '_blank');
    if (win) {
        win.opener = null;
        win.location.href = tgUrl;
        setTimeout(function() {
            try {
                win.close();
            } catch (e) {}
        }, delay);
    }
})();
