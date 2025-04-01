import { SVG, Path } from '@wordpress/primitives';

const faceHappy = {
	label: 'Face Happy',
	svg: (
		<SVG width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="32" cy="32" r="24" fill="#FEE9BC" stroke="#364248" strokeWidth="1.5" />
			<circle cx="23.4444" cy="25.8888" r="2.44444" fill="#364248" />
			<circle cx="40.5555" cy="25.8888" r="2.44444" fill="#364248" />
			<Path
				d="M42.5482 35.12C41.8894 37.3476 40.5422 39.3094 38.6998 40.7243C36.8574 42.1391 34.6144 42.9344 32.2923 42.9961C29.9701 43.0578 27.688 42.3828 25.7731 41.0678C23.8581 39.7528 22.4087 37.8654 21.6324 35.6759"
				stroke="#364248"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</SVG>
	),
};

export default faceHappy;
