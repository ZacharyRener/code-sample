import { SVG, Path } from '@wordpress/primitives';

const faceDisappointed = {
	label: 'Face Disappointed',
	svg: (
		<SVG width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="32" cy="32" r="24" fill="#FEE9BC" stroke="#364248" strokeWidth="1.5" />
			<Path d="M22 40L43 34" stroke="#364248" strokeWidth="1.5" strokeLinecap="round" />
			<circle cx="23.4444" cy="25.8888" r="2.44444" fill="#364248" />
			<circle cx="40.5555" cy="25.8888" r="2.44444" fill="#364248" />
		</SVG>
	),
};

export default faceDisappointed;
