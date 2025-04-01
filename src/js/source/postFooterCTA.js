/**
 * Select a CTA by ID to appear in the footer.
 */
import { __ } from '@wordpress/i18n';
import { store as coreStore, useEntityProp } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { SelectControl, PanelRow } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';

const FooterCTA = () => {
	const {
		hasPostTypeSupport,
		postType,
		ctaSizes = [],
	} = useSelect((select) => {
		const { getEditedPostAttribute } = select(editorStore);
		const { getPostType, getEntityRecords } = select(coreStore);
		const postType = getPostType(getEditedPostAttribute('type'));
		const ctaSizes = getEntityRecords('taxonomy', 'zach-cta-size');

		return {
			postType: postType,
			hasPostTypeSupport: !!postType?.supports?.['footer-cta'],
			ctaSizes: ctaSizes,
		};
	}, []);

	const bannerTerm = ctaSizes?.find((size) => 'banner' === size.slug) ?? undefined;

	// Only render fields if post type supports page attributes or available templates exist.
	if (!hasPostTypeSupport || !postType) {
		return null;
	}

	const { hasResolved: hasResolvedCTAposts, records: ctaPosts } = useEntityRecords(
		'postType',
		'zach-cta',
		{
			per_page: -1,
			'zach-cta-size': bannerTerm?.id ?? 0,
		},
	);

	const ctaPostsOptions =
		hasResolvedCTAposts && ctaPosts
			? [
					{ value: 0, label: __('Select a CTA') },
					...ctaPosts.map((post) => {
						return { label: post.title.raw, value: post.id };
					}),
				]
			: [];

	// Footer CTA enable meta key registered in PHP.
	const meta_key = 'zach_footer_cta_id';

	const [meta, setMeta] = useEntityProp('postType', postType.slug, 'meta');

	// The value of the zach_footer_cta_id meta.
	const zach_footer_cta_id = meta[meta_key];

	// Update the zach_footer_cta_id value.
	const updateMetaValue = (newValue) => {
		setMeta({ ...meta, zach_footer_cta_id: newValue });
	};

	return (
		<PanelRow>
			{ctaPosts && (
				<SelectControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={__('Footer Banner CTA')}
					help={__('Only CTAs with the size of Banner are available.')}
					value={zach_footer_cta_id}
					options={ctaPostsOptions}
					onChange={(newID) => {
						updateMetaValue(newID);
					}}
				/>
			)}
		</PanelRow>
	);
};

export default FooterCTA;
