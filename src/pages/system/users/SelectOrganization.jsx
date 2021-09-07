import React from 'react';
import {Multiselect} from 'multiselect-react-dropdown';

const SelectOrganization = props => {
    const {handleSelectedOrganization, existingOrganizations, selected, multiple, organizations, disabled} = props;

    return (
        <div id={multiple ? 'multi-select' : "custom-select"} className={multiple ? 'mt-4' : ''}>
            {!multiple ? <select onChange={handleSelectedOrganization} value={selected} disabled={disabled}>
                <option value="">Select Org</option>
                {organizations.length > 0
                    ? organizations.map((organization, index) => (
                        <option
                            value={organization.id}
                            key={index}
                        >
                            {organization.name}
                        </option>
                    ))
                    : ''}
            </select> : <div style={{height: 'auto', width: 'auto'}}>
                <Multiselect
                    disable={disabled}
                    options={organizations}
                    placeholder='Select organization'
                    selectedValues={existingOrganizations}
                    displayValue="name"
                    onSelect={handleSelectedOrganization} // Function will trigger on select event
                    onRemove={handleSelectedOrganization} // Function will trigger on remove event
                    required
                />
            </div>}
        </div>
    );
};

export default SelectOrganization;
