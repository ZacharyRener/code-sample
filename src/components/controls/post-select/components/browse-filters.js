/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { __experimentalHStack as HStack } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * External dependencies
 */
import _uniqueId from 'lodash/uniqueId';

/**
 * Internal dependencies
 */
import FormFieldSearch from './form-field-search';
import FormFieldSelect from './form-field-select';

const PostBrowseFilters = ({ filters, onApplyFilters, postSelectArguments, postTypeObject }) => {
	// Form ID.
	const formId = _uniqueId('post-select-modal-filters-');

	const { search } = filters;

	const { terms } = postSelectArguments;

	// Get all terms objects for the current term filters.
	const termFilters = useSelect((select) => {
		// If terms is empty, return an empty array for termFilters.
		if (!terms) {
			return [];
		}

		return terms
			.map((slug) => select('core').getEntityRecord('root', 'taxonomy', slug))
			.filter((term) => !!term);
	});

	const termsForTaxonomy = (taxonomy_slug) => {
		return (
			useSelect((select) => {
				const terms = select(coreStore).getEntityRecords('taxonomy', taxonomy_slug, {
					context: 'view',
					per_page: -1,
				});
				return terms?.map((term) => ({
					value: term.id,
					label: sprintf('%s (%d)', term.name, term.count),
				}));
			}) ?? []
		);
	};

	return (
		<HStack
			alignment="topLeft"
			spacing="3"
			as="form"
			className="post-select-filters"
			onSubmit={(event) => {
				event.preventDefault();
				onApplyFilters(filters);
			}}
		>
			<FormFieldSearch
				label={
					postTypeObject
						? sprintf('Filter %s...', postTypeObject.labels.name)
						: __('Filter posts...')
				}
				placeholder={__('Search')}
				fieldId={`${formId}-search`}
				value={search}
				onChange={(newSearch) =>
					onApplyFilters({
						search: newSearch,
					})
				}
			/>
			{termFilters.length > 0 &&
				termFilters.map((taxonomy) => (
					<FormFieldSelect
						options={termsForTaxonomy(taxonomy.slug)}
						key={`term-filter-${taxonomy.slug}`}
						label={sprintf('Filter by %s', taxonomy.labels.name)}
						placeholder={sprintf('Filter by %s', taxonomy.labels.name)}
						fieldId={`${formId}-${taxonomy.slug}`}
						value={filters[taxonomy.rest_base]}
						onChange={(filterValue) =>
							onApplyFilters({
								[taxonomy.rest_base]: filterValue,
							})
						}
					/>
				))}
		</HStack>
	);
};

export default PostBrowseFilters;
