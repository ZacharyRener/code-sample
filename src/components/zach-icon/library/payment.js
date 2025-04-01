import { SVG, Path } from '@wordpress/primitives';

const payment = {
	label: 'Payment',
	svg: (
		<SVG width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
			<Path
				d="M9 18C9 16.8954 9.89543 16 11 16H53C54.1046 16 55 16.8954 55 18V47.3636H11C9.89543 47.3636 9 46.4682 9 45.3636V18Z"
				fill="white"
				stroke="#364248"
				strokeWidth="1.5"
			/>
			<Path
				d="M14.2273 39.2C14.2273 39.0895 14.3168 39 14.4273 39H22.3909C22.5014 39 22.5909 39.0895 22.5909 39.2V42.9818C22.5909 43.0923 22.5014 43.1818 22.3909 43.1818H14.4273C14.3168 43.1818 14.2273 43.0923 14.2273 42.9818V39.2Z"
				stroke="#364248"
				strokeWidth="1.5"
			/>
			<Path
				d="M55 23.3184H9V28.5456H55V23.3184Z"
				fill="#C2E0DC"
				stroke="#364248"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path d="M55 34.8184L43 46.8184H55V34.8184Z" fill="#3F9F90" />
			<Path
				d="M9 18C9 16.8954 9.89543 16 11 16H53C54.1046 16 55 16.8954 55 18V47.3636H11C9.89543 47.3636 9 46.4682 9 45.3636V18Z"
				stroke="#364248"
				strokeWidth="1.5"
			/>
		</SVG>
	),
};

export default payment;
