function nav(number) {
    document.getElementById("section" + number).scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    })
}

//https://github.com/michalsnik/aos
AOS.init({
    offset: 100,
    easing: 'ease-in-quart',
    duration: 1000,
});