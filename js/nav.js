$(document).ready(function () {
    var winHeight = $(window).height();

    $(window).on('scroll', function () {
        $('section').each(function () {
            let id = $(this).attr("id");

            if ($(window).scrollTop() >= $(this).offset().top - winHeight / 2 && $(window).scrollTop() <= $(this).offset().top + $(this).height() - winHeight / 2) {
                $("#nav" + id).addClass('active')
            } else {
                $("#nav" + id).removeClass('active')
            }
        });
    });
});
