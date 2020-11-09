var pink = "#fcd2d3";

function noop() {};

$(window).scroll(function () {
    showfulltimeline();
    showgeo();
});

function showfulltimeline() {
    var hT = $('#fulltimeline').offset().top,
        hH = $('#fulltimeline').outerHeight(),
        wH = $(window).height(),
        wS = $(this).scrollTop();
    if (wS > (hT + hH - wH)) {
        showfulltimeline = noop;
        fulltimeline();
    }
};

function showgeo() {
    var hT = $('#geo').offset().top,
        hH = $('#geo').outerHeight(),
        wH = $(window).height(),
        wS = $(this).scrollTop();
    if (wS > (hT + hH - wH)) {
        showgeo = noop;
        //noLoop();
        geo();
    }
};

shooting();