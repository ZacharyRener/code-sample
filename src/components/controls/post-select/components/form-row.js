const FormRow = ({ label, labelFor, children }) => (
	<div className="post-select-form-row">
		<label htmlFor={labelFor} className="screen-reader-text">
			{label}
		</label>
		{children}
	</div>
);

export default FormRow;
