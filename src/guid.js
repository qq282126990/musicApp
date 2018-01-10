!function() {
    function e(e) {
        this.url = "",
            this.init(e)
    }
    window.Tcss = {};
    var t, s, r, i, a, n, o, u, h, c, g, f, d, p = "-", l = 0, v = 1, m = 0, T = (document.getElementsByTagName("head")[0],
        "tcss.3.1.5");
    e.prototype = {
        init: function(e) {
            if (i = e || {},
                    t = document,
                !i.statIframe && window != top)
                try {
                    t = top.document
                } catch (a) {}
            "undefined" == typeof t && (t = document),
                s = t.location,
                r = t.body,
                g = [],
                f = [],
                d = []
        },
        run: function() {
            var e, s, r;
            e = Date.now(),
                k.init(),
                this.url += this.getDomainInfo(),
                this.coverCookie(),
                k.setCookie("ssid"),
                k.save(),
                this.url = "//pingfore." + this.getCookieSetDomain(a) + "/pingd?" + this.url,
                this.url += this.getRefInfo(i);
            try {
                this.url += navigator.cookieEnabled ? "&pvid=" + k.setCookie("pgv_pvid", !0) : "&pvid=NoCookie"
            } catch (n) {
                this.url += "&pvid=NoCookie"
            }
            if (this.url += this.getMainEnvInfo(),
                    this.url += this.getExtendEnvInfo(),
                    Tcss.pgUserType = "",
                i.pgUserType || i.reserved2) {
                var o = i.pgUserType || i.reserved2;
                o = escape(o.substring(0, 256)),
                    Tcss.pgUserType = o,
                    d.push("pu=" + Tcss.pgUserType)
            }
            this.url += "&vs=" + T,
                k.setCookie("ts_uid", !0),
                s = (new Date).getTime(),
                g.push("tm=" + (s - e)),
            l && g.push("ch=" + l),
                r = i.extParam ? i.extParam + "|" : "",
                this.url += "&ext=" + escape(r + g.join(";")),
                this.url += "&hurlcn=" + escape(f.join(";")),
                this.url += "&rand=" + Math.round(1e5 * Math.random()),
                this.url += "undefined" == typeof _speedMark ? "&reserved1=-1" : "&reserved1=" + (new Date - _speedMark);
            var u = this.getSud();
            if (u && d.push("su=" + escape(u.substring(0, 256))),
                    this.url += "&tt=" + escape(d.join(";")),
                    this.sendInfo(this.url),
                1 == m) {
                var h = this.getParameter("tcss_rp_dm", t.URL);
                if (h != Tcss.dm) {
                    var c = this.url.replace(/\?dm=(.*?)\&/, "?dm=" + h + "&");
                    this.sendInfo(c)
                }
            }
            i.repeat && (v = 1)
        },
        getSud: function() {
            if (i.sessionUserType)
                return i.sessionUserType;
            var e = i.sudParamName || "sessionUserType"
                , s = this.getParameter(e, t.URL);
            return s
        },
        coverCookie: function() {
            if (i.crossDomain && "on" == i.crossDomain) {
                var e = this.getParameter("tcss_uid", t.URL)
                    , s = this.getParameter("tcss_sid", t.URL)
                    , r = this.getParameter("tcss_refer", t.URL)
                    , a = this.getParameter("tcss_last", t.URL);
                s && e && (m = 1,
                    k.setCookie("ssid", !1, s),
                    k.save(),
                    k.setCookie("ts_refer", !0, r),
                    k.setCookie("ts_last", !0, a),
                    k.setCookie("pgv_pvid", !0, e))
            }
        },
        getDomainInfo: function(e) {
            var t, r;
            return t = s.hostname.toLowerCase(),
            i.virtualDomain && (f.push("ad=" + t),
                t = i.virtualDomain),
                r = this.getCurrentUrl(),
                Tcss.dm = t,
                a = Tcss.dm,
            o || (o = this.getCookieSetDomain(s.hostname.toLowerCase())),
            e && (Tcss.dm += ".hot"),
            "dm=" + Tcss.dm + "&url=" + Tcss.url
        },
        getCurrentUrl: function() {
            var e = ""
                , r = p;
            if (e = n = escape(s.pathname),
                "" != s.search && (r = escape(s.search.substr(1))),
                    i.senseParam) {
                var a = this.getParameter(i.senseParam, t.URL);
                a && (e += "_" + a)
            }
            i.virtualURL && (f.push("au=" + e),
                e = i.virtualURL),
                Tcss.url = e,
                Tcss.arg = r
        },
        getRefInfo: function(e) {
            var r, a, n, o = p, c = p, d = p, v = t.referrer;
            if (r = e.tagParamName || "ADTAG",
                    a = e.ADTAG && this.getParameter(r, t.URL) ? e.ADTAG + "." + this.getParameter(r, t.URL) : e.ADTAG || this.getParameter(r, t.URL),
                    n = v.indexOf("://"),
                n > -1) {
                var T = /(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(#.*)?(\?.*)?/i
                    , w = v.match(T);
                w && (o = w[2],
                    c = w[4] + (w[5] ? w[5] : ""))
            }
            if (-1 != v.indexOf("?")) {
                var n = v.indexOf("?") + 1;
                d = v.substr(n)
            }
            var _ = o;
            i.virtualRefDomain && (o != p && f.push("ard=" + o),
                o = i.virtualRefDomain),
            i.virtualRefURL && (c != p && f.push("aru=" + escape(c)),
                c = i.virtualRefURL);
            var C;
            if (a && (C = o + c,
                    o = "ADTAG",
                    c = a),
                    u = o,
                    h = escape(c),
                u == p || "ADTAG" == u && _ == p) {
                var D = k.get("ts_last=", !0);
                D != p && g.push("ls=" + D)
            }
            k.setCookie("ts_last", !0, escape((s.hostname + s.pathname).substring(0, 128)));
            var U = k.get("ts_refer=", !0);
            U != p && g.push("rf=" + U);
            var y = s.hostname;
            if (i.inner && (y = "," + y + "," + i.inner + ","),
                    !(u == p || ("," + y + ",").indexOf(u) > -1 || 1 == m)) {
                var b = escape((u + c).substring(0, 128));
                b != U && (l = 2),
                    k.setCookie("ts_refer", !0, b)
            }
            return Tcss.rdm = u,
                Tcss.rurl = h,
                Tcss.rarg = escape(d),
                C ? "&rdm=" + Tcss.rdm + "&rurl=" + Tcss.rurl + "&rarg=" + Tcss.rarg + "&or=" + C : "&rdm=" + Tcss.rdm + "&rurl=" + Tcss.rurl + "&rarg=" + Tcss.rarg
        },
        getMainEnvInfo: function() {
            var e = "";
            try {
                var t = p
                    , s = p
                    , r = p
                    , i = p
                    , a = p
                    , n = 0
                    , o = navigator;
                self.screen && (t = screen.width + "x" + screen.height,
                    s = screen.colorDepth + "-bit"),
                    o.language ? r = o.language.toLowerCase() : o.browserLanguage && (r = o.browserLanguage.toLowerCase()),
                    n = o.javaEnabled() ? 1 : 0,
                    i = o.platform,
                    a = (new Date).getTimezoneOffset() / 60,
                    e = "&scr=" + t + "&scl=" + s + "&lang=" + r + "&java=" + n + "&pf=" + i + "&tz=" + a
            } catch (u) {} finally {
                return e
            }
        },
        getExtendEnvInfo: function() {
            var e = "";
            try {
                var t = s.href
                    , i = p;
                r.addBehavior && (r.addBehavior("#default#homePage"),
                r.isHomePage(t) && (e += "&hp=Y")),
                r.addBehavior && (r.addBehavior("#default#clientCaps"),
                    i = r.connectionType),
                    e += "&ct=" + i
            } catch (a) {} finally {
                return e
            }
        },
        getParameter: function(e, t) {
            if (e && t) {
                var s = new RegExp("(\\?|#|&)" + e + "=([^&^#]*)(#|&|$)")
                    , r = t.match(s);
                return r ? r[2] : ""
            }
            return ""
        },
        getCookieSetDomain: function(e) {
            for (var t, s, r, i = [], a = 0, n = 0; n < e.length; n++)
                "." == e.charAt(n) && (i[a] = n,
                    a++);
            return t = i.length,
                s = e.indexOf(".cn"),
            s > -1 && t--,
                r = "qq.com",
                1 == t ? r = e : t > 1 && (r = e.substring(i[t - 2] + 1)),
                r
        },
        sendClick: function() {
            i.hottag && (this.url += this.getDomainInfo(!0),
                this.url += "&hottag=" + escape(i.hottag),
                this.url += "&hotx=9999&hoty=9999",
                this.url += "&rand=" + Math.round(1e5 * Math.random()),
                this.url = "//pingfore." + this.getCookieSetDomain(a) + "/pingd?" + this.url,
                this.sendInfo(this.url))
        },
        pgvGetArgs: function() {
            this.getDomainInfo();
            var e = [];
            return e.push("tcss_rp_dm=" + Tcss.dm),
                e.push("tcss_uid=" + k.get("pgv_pvid=", !0)),
                e.push("tcss_sid=" + k.get("ssid=", !0)),
                e.push("tcss_refer=" + k.get("ts_refer=", !0)),
                e.push("tcss_last=" + k.get("ts_last=", !0)),
                e.join("&")
        },
        sendInfo: function(e) {
            window.M && "function" == typeof M.report ? M.report(e, null, window.tj_param && window.tj_param.isImmediately, !0) : (c = new Image(1,1),
                c.onload = c.onerror = c.onabort = function() {
                    c.onload = c.onerror = c.onabort = null
                }
                ,
                c.src = e)
        }
    };
    var k = {
        sck: [],
        sco: {},
        init: function() {
            var e = this.get("pgv_info=", !0);
            if (e != p)
                for (var t = e.split("&"), s = 0; s < t.length; s++) {
                    var r = t[s].split("=");
                    this.set(r[0], unescape(r[1]))
                }
        },
        get: function(e, s) {
            var r, i, a = s ? t.cookie : this.get("pgv_info=", !0), n = p;
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
        },
        set: function(e, t) {
            this.sco[e] = t;
            for (var s = !1, r = this.sck.length, i = 0; r > i; i++)
                if (e == this.sck[i]) {
                    s = !0;
                    break
                }
            s || this.sck.push(e)
        },
        setCookie: function(e, t, r) {
            var i = s.hostname
                , a = k.get(e + "=", t);
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
                a = t ? "" : "s";
                var n = (new Date).getUTCMilliseconds();
                a += Math.round(2147483647 * Math.abs(Math.random() - 1)) * n % 1e10
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
                        this.saveCookie(e + "=" + a, o, "expires=Sun, 18 Jan 2038 00:00:00 GMT;")
                }
            else
                this.set(e, a);
            console.log(a)
            return a
        },
        getExpires: function(e) {
            var t = new Date;
            return t.setTime(t.getTime() + 60 * e * 1e3),
            "expires=" + t.toGMTString()
        },
        save: function() {
            if (i.sessionSpan) {
                var e = new Date;
                e.setTime(e.getTime() + 60 * i.sessionSpan * 1e3)
            }
            for (var t = "", s = this.sck.length, r = 0; s > r; r++)
                t += this.sck[r] + "=" + this.sco[this.sck[r]] + "&";
            t = "pgv_info=" + t.substr(0, t.length - 1);
            var a = "";
            e && (a = "expires=" + e.toGMTString()),
                this.saveCookie(t, o, a)
        },
        saveCookie: function(e, s, r) {
            t.cookie = e + ";path=/;domain=" + s + ";" + r
        }
    };
    window.pgvMain = function(t, s) {
        var r = "";
        s ? (r = s,
            T = "tcsso.3.1.5") : (r = t,
            T = "tcss.3.1.5");
        try {
            if (1 != v)
                return;
            v = 2,
                new e(r).run()
        } catch (i) {}
    }
        ,
        window.pgvSendClick = function(t) {
            new e(t).sendClick()
        }
        ,
        window.pgvGetArgs = function(t) {
            return new e(t).pgvGetArgs()
        }
    console.log((document.getElementsByTagName("head")[0],
        "tcss.3.1.5"))
}();
/*  |xGv00|65f206c3dd49d772373beb4b37e72b53 */
