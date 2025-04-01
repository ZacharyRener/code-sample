/**
 * The main load-more file.
 *
 * Adds event listeners to any found
 * load more buttons.
 *
 * @package
 * @module zach/blocks/load-more
 */

import { loadMoreButtons } from './elements';
import { loadMoreListener } from './listener';

if (loadMoreButtons) {
	for (let i = 0; i < loadMoreButtons.length; i++) {
		loadMoreButtons[i].addEventListener('click', loadMoreListener);
	}
}
