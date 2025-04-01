/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { store as coreStore } from '@wordpress/core-data';
import { PluginPostStatusInfo } from '@wordpress/edit-post';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	CheckboxControl,
	BaseControl,
	__experimentalHStack as HStack,
} from '@wordpress/components';

/**
 * Add a list of checkboxes for the sizes within the Summary panel.
 */
const CtaSizesPostStatusInfo = () => {
	// The taxonomy which we are going to provide a checkbox list for.
	const taxonomy = 'zach-cta-size';

	const { editPost } = useDispatch('core/editor');

	// Fetch the currentPost Type and terms associated with the current post.
	const { postType, selectedTerms } = useSelect((select) => {
		const { getEditedPostAttribute } = select('core/editor');
		const { getPostType } = select(coreStore);
		const postType = getPostType(getEditedPostAttribute('type'));

		const terms = getEditedPostAttribute(taxonomy) || [];
		return {
			postType: postType,
			selectedTerms: Array.isArray(terms) ? terms : [],
		};
	}, []);

	// Check we are in an editor which supports a postType.
	// Check we are on a postType which supports the taxonomy.
	if (!postType || false === postType?.taxonomies.some((tax) => tax === taxonomy)) {
		return null;
	}

	// Get the list of available CTA Size terms.
	const { availableTerms = [] } = useSelect(
		(select) => {
			const { getEntityRecords } = select(coreStore);

			return {
				availableTerms:
					getEntityRecords('taxonomy', taxonomy, {
						_fields: 'id,name',
						context: 'view',
					}) ?? [],
			};
		},
		[taxonomy],
	);

	// When updating a an array of term ids.
	const onUpdateTerms = (termIds) => {
		editPost({ [taxonomy]: termIds });
	};

	// Update an existing termId.
	const onChange = (termId) => {
		const hasTerm = selectedTerms.includes(termId);
		const newTerms = hasTerm
			? selectedTerms.filter((id) => id !== termId)
			: [...selectedTerms, termId];
		onUpdateTerms(newTerms);
	};

	return (
		<PluginPostStatusInfo>
			<HStack className={'editor-post-panel__row'}>
				<div className="editor-post-panel__row-label">{__('CTA Sizes', 'zach')}</div>
				<div className="editor-post-panel__row-control">
					<BaseControl
						className="cta-sizes-post-status-info "
						tabIndex="0"
						role="group"
						aria-label={__('Supported CTA Frame Sizes', 'zach')}
					>
						{availableTerms.map((term) => (
							<div key={term.id} className="editor-post-taxonomies__hierarchical-terms-choice">
								<CheckboxControl
									__nextHasNoMarginBottom
									key={term.id}
									label={term.name}
									checked={selectedTerms.includes(term.id)}
									onChange={() => {
										const termId = parseInt(term.id, 10);
										onChange(termId);
									}}
								/>
							</div>
						))}
					</BaseControl>
				</div>
			</HStack>
		</PluginPostStatusInfo>
	);
};

registerPlugin('zach-cta-size-post-status-info', {
	render: CtaSizesPostStatusInfo,
});
