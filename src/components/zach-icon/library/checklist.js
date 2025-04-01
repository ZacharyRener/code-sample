import { SVG, Path } from '@wordpress/primitives';

const checklist = {
	label: 'Checklist',
	svg: (
		<SVG width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
			<Path
				d="M15 15C15 13.8954 15.8954 13 17 13H48C49.1046 13 50 13.8954 50 15V57.6711H17C15.8954 57.6711 15 56.7756 15 55.6711V15Z"
				fill="white"
				stroke="#364248"
				strokeWidth="1.5"
			/>
			<rect
				x="20"
				y="33"
				width="4"
				height="4"
				rx="0.1"
				fill="#FEE9BC"
				stroke="#364248"
				strokeWidth="1.5"
			/>
			<rect
				x="20"
				y="23"
				width="4"
				height="4"
				rx="0.1"
				fill="#FEE9BC"
				stroke="#364248"
				strokeWidth="1.5"
			/>
			<rect
				x="20"
				y="43"
				width="4"
				height="4"
				rx="0.1"
				fill="#FEE9BC"
				stroke="#364248"
				strokeWidth="1.5"
			/>
			<Path d="M31 25H43" stroke="#364248" strokeWidth="1.5" strokeLinecap="round" />
			<Path d="M31 35H43" stroke="#364248" strokeWidth="1.5" strokeLinecap="round" />
			<Path d="M31 45H43" stroke="#364248" strokeWidth="1.5" strokeLinecap="round" />
			<Path d="M50 45L38 57H50V45Z" fill="#FFC342" />
			<Path
				d="M15 15C15 13.8954 15.8954 13 17 13H48C49.1046 13 50 13.8954 50 15V57.6711H17C15.8954 57.6711 15 56.7756 15 55.6711V15Z"
				stroke="#364248"
				strokeWidth="1.5"
			/>
			<Path
				d="M22 13C22 11.8954 22.8954 11 24 11H28C28 11 28.5 11 28.3636 10.0741C28.1389 8.54785 29.1256 6 32 6C34.8744 6 35.8644 8.52557 35.6364 10.0741C35.5 11 36 11 36 11H40C41.1046 11 42 11.8954 42 13V15.5C42 15.7761 41.7761 16 41.5 16H22.5C22.2239 16 22 15.7761 22 15.5V13Z"
				fill="white"
				stroke="#364248"
				strokeWidth="1.5"
			/>
			<circle cx="32" cy="10" r="2" fill="#FFC342" />
		</SVG>
	),
};

export default checklist;
