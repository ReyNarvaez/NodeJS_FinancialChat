module.exports.getCookies = function (req, res){

    var cookie = req.cookies.session;

    if(cookie == undefined){

        cookie = {'_id' : null, 'token': null, 'error' : null};
        res.cookie('session', cookie);
    }

    return cookie;
};

function getCookiesFromError(err){

  	var cookies = err.headers['set-cookie'];

    return cookies;
};

module.exports.hasCookieWithError = function (err){

    var cookies = getCookiesFromError(err);
    cookies = cookies[cookies.length - 1];
    var cookie = JSON.parse(unescape(cookies).split("j:")[1].split(";")[0]);  

    return cookie.error != null;
};