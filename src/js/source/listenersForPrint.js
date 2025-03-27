// Attach print functionality to all links with href="#print"
const printLinks = () => {
	document.querySelectorAll('a[href="#print"]').forEach((link) => {
		link.addEventListener('click', (event) => {
			event.preventDefault();
			window.print();
		});
	});
};

// Run on DOMContentLoaded.
document.addEventListener('DOMContentLoaded', printLinks);
