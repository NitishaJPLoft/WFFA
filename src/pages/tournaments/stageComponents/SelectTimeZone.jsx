import React from 'react';
import { Multiselect } from 'multiselect-react-dropdown';

const SelectTimeZones = props => {
    const {timeZones, handleSelectedTimeZone, selected} = props;

    return (
        <React.Fragment>
            <div id="custom-select">
                <Multiselect
                    options={timeZones}
                    selectedValues={selected}
                    displayValue="label"
                    onSelect={handleSelectedTimeZone}
                    onRemove={handleSelectedTimeZone}
                    selectionLimit={1}
                    required
                />
            </div>
        </React.Fragment>
    );
};

export default SelectTimeZones;
