import { SVG, Path } from '@wordpress/primitives';

const faceSad = {
	label: 'Face Sad',
	svg: (
		<SVG width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="32" cy="32" r="24" fill="#FEE9BC" stroke="#364248" strokeWidth="1.5" />
			<circle cx="23.4444" cy="25.8888" r="2.44444" fill="#364248" />
			<circle cx="40.5555" cy="25.8888" r="2.44444" fill="#364248" />
			<Path
				d="M21.4518 40.88C22.1106 38.6524 23.4578 36.6906 25.3002 35.2757C27.1426 33.8609 29.3856 33.0656 31.7077 33.0039C34.0299 32.9422 36.312 33.6172 38.2269 34.9322C40.1419 36.2472 41.5913 38.1346 42.3676 40.3241"
				stroke="#364248"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</SVG>
	),
};

export default faceSad;
