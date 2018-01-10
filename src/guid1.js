var p = '-'
function setCookie(e, t, r) {
    var i = location.hostname
        , a = get(e + "=", t);
    if (a != p || r)
        a = r ? r : a;
    else {
        switch (e) {
            case "ts_uid":
                g.push("nw=1");
                break;
            case "ssid":
                l = 1
        }
        var n = (new Date).getUTCMilliseconds();

        a = t ? "" : "s";
        a += Math.round(2147483647 * Math.abs(Math.random() - 1)) * (new Date).getUTCMilliseconds() % 1e10
    }
    if (t)
        switch (e) {
            case "ts_uid":
                this.saveCookie(e + "=" + a, i, this.getExpires(1051200));
                break;
            case "ts_refer":
                this.saveCookie(e + "=" + a, i, this.getExpires(259200));
                break;
            case "ts_last":
                this.saveCookie(e + "=" + a, i, this.getExpires(30));
                break;
            default:
                this.saveCookie(e + "=" + a, "expires=Sun, 18 Jan 2038 00:00:00 GMT;")
        }
    else
        this.set(e, a);

    return a
}

console.log('guid= '+ setCookie("pgv_pvid", document))

function saveCookie(e, s, r) {
    document.cookie = e + ";path=/;domain=" + s + ";" + r
}

function get(e, s) {
    var r, i, a = s ? document.cookie : this.get("pgv_info=", !0), n = p;
    if (r = a.indexOf(e),
        r > -1) {
        if (r += e.length,
                i = a.indexOf(";", r),
            -1 == i && (i = a.length),
                !s) {
            var o = a.indexOf("&", r);
            o > -1 && (i = Math.min(i, o))
        }
        n = a.substring(r, i)
    }
    return n
}

get()
