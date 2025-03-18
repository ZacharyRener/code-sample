import { SVG, Path } from '@wordpress/primitives';

const confirmation = {
	label: 'Confirmation',
	svg: (
		<SVG width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="32" cy="32" r="24" fill="#82C1B7" stroke="#364248" strokeWidth="1.5" />
			<circle cx="32" cy="32" r="18" fill="white" stroke="#364248" strokeWidth="1.5" />
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M43.03 26.0743C43.5493 26.6209 43.5271 27.4849 42.9805 28.0042L29.5959 40.7196C29.0592 41.2294 28.2139 41.2186 27.6904 40.6951L22.1656 35.1703C21.6325 34.6372 21.6325 33.7729 22.1656 33.2398L23.6135 31.7919C24.1466 31.2588 25.0109 31.2588 25.544 31.7919L27.776 34.0239C28.2994 34.5473 29.1447 34.5581 29.6814 34.0483L39.6898 24.5403C40.2364 24.021 41.1004 24.0432 41.6197 24.5898L43.03 26.0743Z"
				fill="#C2E0DC"
				stroke="#364248"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
		</SVG>
	),
};

export default confirmation;
