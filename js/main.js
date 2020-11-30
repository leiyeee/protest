var pink = "#fcd2d3";

function noop() {};

$(window).scroll(function () {
    showfulltimeline();
//    showgeo();
    moveVideo();
    hideVideo();
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

//
//function showgeo() {
//    var hT = $('#geo').offset().top,
//        hH = $('#geo').outerHeight(),
//        wH = $(window).height(),
//        wS = $(this).scrollTop();
//    if (wS > (hT + hH - wH)) {
//        showgeo = noop;
//        //noLoop();
//        geo();
//    }
//};

function moveVideo() {
    var hT = $('#videoText').offset().top,
        hH = $('#videoText').outerHeight(),
        wH = $(window).height(),
        wS = $(this).scrollTop();
    if (wS > (hT + hH - wH - 50)) {
        noLoop();
        document.getElementById("video").style.transition = "all 1s";
        document.getElementById("video").style.position = "fixed";
        document.getElementById("video").style.top = "25px";
        document.getElementById("video").style.right = "25px";
        document.getElementById("video").style.width = "30vw";
        document.getElementById("video").style.height = "calc(100vh - 50px)";
        document.getElementById("videoText").style.transition = "all 1s";
        document.getElementById("videoText").style.height = "100vh";
        document.getElementById("videoText").style.display = "flex";
        document.getElementById("videoText").style.alignItems = "center";
        document.getElementById("videoText").style.alignItems = "center";
        document.getElementById("videoText").style.justifyContent = "center";
        document.getElementById("section1").style.height = "auto";
        //moveVideo = noop;
    }
};

function hideVideo() {
    var hT = $('#section1').offset().top,
        hH = $('#section1').outerHeight(),
        wH = $(window).height(),
        wS = $(this).scrollTop();
    if (wS > (hT + hH - 500)) {
        document.getElementById("video").style.transition = "all 0.5s";
        document.getElementById("video").style.width = "0";
        //document.getElementById("video").style.display = "none";
        hideVideo = hideVideoTopBot;
    }
};

function hideVideoTopBot() {
    var hT = $('#section1').offset().top,
        hH = $('#section1').outerHeight(),
        wH = $(window).height(),
        wS = $(this).scrollTop();
    if (wS > (hT + hH - 500) || wS < hT - 500) {
        document.getElementById("video").style.transition = "all 0.5s";
        document.getElementById("video").style.width = "0";
        //document.getElementById("video").style.display = "none";
        //hideVideo = noop;
    }
};

shooting();