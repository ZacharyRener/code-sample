/**
 * WordPress dependencies.
 */
import { useState } from '@wordpress/element';
import {
	SearchControl,
	Button,
	Flex,
	FlexItem,
	__experimentalVStack as VStack,
	__experimentalScrollable as Scrollable,
} from '@wordpress/components';
import { sprintf, __, _x } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';

/**
 * Internal dependencies.
 */
import { ZachIcon, icons } from '../components/zach-icon';

// The contents of the block toolbar dropdown.
const IconPicker = ({ value, setIcon }) => {
	// Search state.
	const [searchFilter, setSearchFilter] = useState('');

	// Filter the connection options by the search filter.
	const filteredIcons = Object.entries(icons)
		.filter(([key, value]) => {
			return searchFilter
				? key.toLowerCase().includes(searchFilter.toLowerCase()) ||
						value.label.toLowerCase().includes(searchFilter.toLowerCase())
				: true;
		})
		.map(([key, value]) => ({ key, icon: value }));

	return (
		<VStack
			alignment="stretch"
			style={{ minWidth: '100%', width: '100%' }}
			className="zach-icon-picker"
			spacing="1"
		>
			<SearchControl
				label={__('Filter Icons', 'zach')}
				hideLabelFromVision={true}
				key="search-control"
				size="compact"
				value={searchFilter}
				onChange={setSearchFilter}
				placeholder={__('Filter Icons...', 'zach')}
			/>
			<Scrollable style={{ maxHeight: 130 }}>
				<Flex className="zach-icon-picker-list" align="start" justify="start" wrap={true}>
					{filteredIcons.map(({ key, icon }) => (
						<FlexItem key={key} className="zach-icon-picker-icon">
							<Button
								onClick={() => {
									const iconSetMessage = sprintf(
										/* translators: %s: icon name. */
										_x('Icon set to "%s."', 'zach'),
										icon.label,
									);
									speak(iconSetMessage);
									setIcon(key);
								}}
								showTooltip={true}
								label={icon.label}
								className={key === value ? 'is-set' : ''}
							>
								<ZachIcon icon={key} size={36} />
							</Button>
						</FlexItem>
					))}
					{0 === filteredIcons.length && (
						<span className="zach-icon-picker-no-results">
							{sprintf(
								/* translators: %s: search filter string. */
								_x('No results for "%s."', 'zach'),
								searchFilter,
							)}
							&nbsp;
							<Button variant="link" onClick={() => setSearchFilter('')}>
								{__('Reset', 'zach')}
							</Button>
						</span>
					)}
				</Flex>
			</Scrollable>
		</VStack>
	);
};

export default IconPicker;
