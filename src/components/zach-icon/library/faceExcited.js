import { SVG, Path } from '@wordpress/primitives';

const faceExcited = {
	label: 'Face Excited',
	svg: (
		<SVG width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="32" cy="32" r="24" fill="#FEE9BC" stroke="#364248" strokeWidth="1.5" />
			<circle cx="23.4444" cy="25.8888" r="2.44444" fill="#364248" />
			<circle cx="40.5555" cy="25.8888" r="2.44444" fill="#364248" />
			<Path
				d="M42.5 35.0002C42.5 40.7992 37.799 45.5002 32 45.5002C26.201 45.5002 21.5 40.7992 21.5 35.0002L32 35L42.5 35.0002Z"
				fill="#364248"
			/>
		</SVG>
	),
};

export default faceExcited;
