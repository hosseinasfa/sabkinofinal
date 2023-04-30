function toggle_loading(delay = 0) {
    var display = $('.loading').css('display');
    if (display == 'none') {
        $('.loading').css('display', 'flex');
        return true;
    } else {
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
}

function open_loading() {
    $('.loading').css('display', 'flex');
    return true;
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


$(document).ready(function () {
    if ($('.show-mini-cart').length > 0) {
        $('.show-mini-cart').off('click').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            $('#list_popover').fadeToggle();
            return false;
        });
    }

    $('#btn_user_menu').click(function (e) {
        e.preventDefault();
        $('.top_user_menu_box').fadeToggle(250);
    });

    function openNav() {
        $('body').css('overflow', 'hidden');
        $('.sidenav_back').show();
        var mySidenav = document.getElementById("mySidenav");
        if (mySidenav !== null) {
            mySidenav.style.width = "calc(100% - 10rem)";
        }
    }

    function closeNav() {
        $('body').css('overflow', 'visible');
        $('.sidenav_back').hide();
        var mySidenav = document.getElementById("mySidenav");
        if (mySidenav !== null) {
            mySidenav.style.width = "0";
        }
    }

    $('#menu-toggle').click(function () {
        openNav();
    });

    $(document).mouseup(function (e) {
        if ($(e.target).closest(".top_user_menu_box").length
            === 0) {
            $(".top_user_menu_box").fadeOut(200);
        }
    });

    $('#upload_reserve_file').click(function () {
        toggle_loading();
    });

    $('#upload_order_file').click(function () {
        toggle_loading();
    });

    $('ul.top_breadcrumb li a').click(function () {
        toggle_loading();
    });

    $('div.home_item a').click(function () {
        toggle_loading();
    });

    $('ul.mobile_menu li a').click(function () {
        toggle_loading();
    });

    $('div.item_button_box a').click(function () {
        toggle_loading();
    });

    $('#SaveAccount').click(function () {
        toggle_loading();
    });


    $('.sidenav_back').click(function () {
        $(this).hide();
        closeNav();
        closeHall();
    });
    //
    // $(document).mouseup(function (e) {
    //     var container = $("mySidenav");
    //
    //     // if the target of the click isn't the container nor a descendant of the container
    //     if (!container.is(e.target) && container.has(e.target).length === 0) {
    //         closeNav();
    //         closeHall();
    //     }
    // });


    function openHall() {
        $('body').css('overflow', 'hidden');
        $('.sidenav_back').show();
        $('.hall-select').fadeIn(300);
    }

    function closeHall() {
        $('body').css('overflow', 'visible');
        $('.sidenav_back').hide();
        $('.hall-select').hide();
    }


    $('#btn_hall').click(function () {
        openHall();
    });

});

$(document).on('click', '.mega-dropdown', function (e) {
    e.stopPropagation()
});

function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        var i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        var j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands);
    } catch (e) {
        console.log(e)
    }
};
