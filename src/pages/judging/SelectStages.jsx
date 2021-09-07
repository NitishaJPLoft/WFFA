import React from 'react';
import { Multiselect } from 'multiselect-react-dropdown';

const SelectStages = props => {
    const {stages, handleSelectedStage, selected, disabled} = props;

    return (
        <React.Fragment>
            <div id="custom-select">
                <Multiselect
                    disable={disabled}
                    options={stages}
                    selectedValues={selected}
                    displayValue="name"
                    onSelect={handleSelectedStage}
                    onRemove={handleSelectedStage}
                    selectionLimit={1}
                    required
                />
            </div>
        </React.Fragment>
    );
};

export default SelectStages;
