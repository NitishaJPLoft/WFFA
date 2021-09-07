import React from 'react';

const RadioLayout = props => {
    const {id, name, label, handleChange, disabled} = props;
    return (
        <div className="custom-control custom-radio">
            <input
                
                type="radio"
                id={id}
                name={name}
                disabled={disabled}
                value={props.value}
                checked={props.checked}
                className="custom-control-input"
                onChange={(e) => handleChange(e.target.value)}
            />
            <label className="custom-control-label" htmlFor={id}>
                {label}
            </label>
        </div>
    );
};

export default RadioLayout;
