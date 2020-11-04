function nav(number) {
    document.getElementById("section" + number).scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    })
}
