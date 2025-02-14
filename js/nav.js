window.addEventListener('DOMContentLoaded', () => {

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			const id = entry.target.getAttribute('id');
			if (entry.intersectionRatio > 0) {
				document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.add('active');
			} else {
				document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.remove('active');
			}
		});
	});

	document.querySelectorAll('section[id]').forEach((section) => {
		observer.observe(section);
	});
	
});
/* credit to https://codemyui.com/jump-link-sidebar-navigation-for-articles/*/
/*we cited the navigation javascript for the responsive meanu*/