import React from 'react';
import {Multiselect} from 'multiselect-react-dropdown';

const SelectApp = props => {
    const {handleSelectedApp, existingApps, selected, disabled, multiple, apps} = props;

    return (
        <React.Fragment>
            <br/>
            <p>
                <strong>Applications</strong>
            </p>
            <div id={multiple ? 'multi-select' : "custom-select"}>
                {multiple ?
                    <Multiselect
                        disable={disabled}
                        options={apps}
                        selectedValues={existingApps}
                        displayValue="name"
                        onSelect={handleSelectedApp}
                        onRemove={handleSelectedApp}
                        required
                    /> :
                    <select onChange={handleSelectedApp} value={selected} disabled={disabled}>
                        <option value="">Select</option>
                        {apps && apps.length > 0
                            ? apps.map((app, index) => (
                                <option
                                    value={app.id}
                                    key={index}
                                    defaultValue={selected}
                                >
                                    {app.name}
                                </option>
                            ))
                            : ''}
                    </select>
                }
            </div>

        </React.Fragment>
    );
};

export default SelectApp;
