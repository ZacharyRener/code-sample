/**
 * WordPress Dependencies
 */
import { FormTokenField } from '@wordpress/components';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import FormRow from './form-row';

import './form-field-select.scss';

const FormFieldSelect = ({ fieldId, label, onChange, options = [], placeholder, value }) => {
	// We want to build the suggestions from the passed.
	const suggestions = useMemo(() => {
		return (options ?? []).map((item) => item.label);
	}, [options]);

	/**
	 * Handle change in the token list.
	 */
	const handleChange = (results) => {
		const ids = Array.from(
			results.reduce((accumulator, name) => {
				// Verify that new values point to existing entities.
				const foundItem = options.find((item) => item.label === name);
				if (foundItem) {
					accumulator.add(foundItem.value);
				}
				return accumulator;
			}, new Set()),
		);

		onChange(ids);
	};

	/**
	 * Given a value, return the label from the term list.
	 */
	const returnNameForTermId = (value) => {
		if (options?.length > 0) {
			const foundItem = options.find((option) => option.value === value);
			return foundItem ? foundItem.label : value;
		}
		return value;
	};

	// If there are no options, please wait.
	if (options?.length < 1) {
		return null;
	}

	return (
		<FormRow labelFor={fieldId} label={label}>
			<FormTokenField
				__experimentalExpandOnFocus
				__next40pxDefaultSize
				label={label}
				id={fieldId}
				suggestions={suggestions}
				//onInputChange={(s) => onUpdateSearch && onUpdateSearch(s)}
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				maxSuggestions={100}
				displayTransform={(item) => {
					// This converts the term id into the label.
					return returnNameForTermId(item) ?? item;
				}}
			/>
		</FormRow>
	);
};

export default FormFieldSelect;
