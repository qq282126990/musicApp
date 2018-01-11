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

function get() {
    let t = '10';
    let n = '5381';
    if (t){
        for (var i = 0, o = t.length; o > i; ++i){
            n += (n << 5) + t.charCodeAt(i);
        }
    }

    console.log(2147483647 & n)
}
get()
