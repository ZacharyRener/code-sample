export const defaultTemplate = [
	[
		'core/group',
		{
			layout: { type: 'flex', orientation: 'vertical' },
			style: { spacing: { padding: { top: '0', right: '0', bottom: '0', left: '0' } } },
		},
		[
			[
				'core/heading',
				{
					placeholder: '$900 Million',
					level: 2,
					className: 'card__title',
				},
			],
			[
				'core/paragraph',
				{
					placeholder: 'Since 1978, the Foundation has raised over $900 Million dollars.',
					className: 'card__excerpt',
				},
			],
		],
	],
];

export const statisticsInnerBlocksTemplate = [
	[
		'core/group',
		{
			layout: { type: 'flex', orientation: 'vertical' },
			style: { spacing: { padding: { top: '0', right: '0', bottom: '0', left: '0' } } },
		},
		[
			[
				'core/group',
				{
					layout: { type: 'flex', flexWrap: 'nowrap' },
					style: { spacing: { padding: { top: '0', right: '0', bottom: '0', left: '0' } } },
				},
				[
					['zach/zach-icon'],
					[
						'core/heading',
						{
							placeholder: '14,500',
							level: 2,
							className: 'card__title',
							style: {
								typography: {
									fontStyle: 'normal',
									fontWeight: '700',
								},
							},
							fontSize: 'xx-large',
						},
					],
				],
			],
			[
				'core/paragraph',
				{
					placeholder:
						'Number of underserved patients seen by BSW Community Care Clinics each year.',
					className: 'card__excerpt',
				},
			],
		],
	],
];
