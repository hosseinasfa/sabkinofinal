function toggle_loading(delay = 0) {
    var display = $('.loading').css('display');
    if (display == 'none') {
        $('.loading').css('display', 'flex');
    } else {
        if (delay > 0) {
            setTimeout(
                function () {
                    $('.loading').css('display', 'none');
                    //do something special
                }, delay);
        } else {
            $('.loading').css('display', 'none');
        }
    }
}
function open_loading() {
    $('.loading').css('display', 'flex');
    return true;
}

function fadeBox(delay = 50) {
    $('.sidenav_back').fadeToggle(delay);
}

function fadeBoxIn(delay = 50) {
    $('.sidenav_back').fadeIn(delay);
}

function fadeBoxOut(delay = 50) {
    $('.sidenav_back').fadeOut(delay);
}


function close_loading(delay = 0) {
    if (delay > 0) {
        setTimeout(
            function () {
                $('.loading').css('display', 'none');
                //do something special
            }, delay);
        return true;
    } else {
        $('.loading').css('display', 'none');
        return true;
    }
}

function number_format(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
