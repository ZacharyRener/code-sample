// Search template refresh results.

// Define elements.
const form = document.querySelector('form#zach-site-search');
const postTypeOptions = document.querySelectorAll(
	'.zach-site-search-post-types input[type="radio"]',
);

const siteSearch = () => {
	// When a post type option changes.
	const handlePostTypeChange = () => {
		form.submit();
	};

	// Handle listening for a post type change.
	postTypeOptions.forEach((option) => {
		option.addEventListener('change', handlePostTypeChange);
	});
};

// Run.
siteSearch();
