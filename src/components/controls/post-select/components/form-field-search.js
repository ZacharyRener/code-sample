/**
 * Internal dependencies
 */
import { SearchControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import FormRow from './form-row';

const FormFieldSearch = ({ fieldId, label, placeholder, value, onChange }) => (
	<FormRow label={label} labelFor={fieldId}>
		<SearchControl
			label={label}
			hideLabelFromVision={false}
			id={fieldId}
			placeholder={placeholder}
			type="search"
			value={value}
			onChange={onChange}
		/>
	</FormRow>
);

export default FormFieldSearch;
