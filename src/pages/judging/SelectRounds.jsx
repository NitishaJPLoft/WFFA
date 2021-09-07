import React from 'react';
import { Multiselect } from 'multiselect-react-dropdown';

const SelectRounds = props => {
    const {rounds, handleSelectedRound, selected, disabled} = props;

    return (
        <React.Fragment>
            <div id="custom-select">
                <Multiselect
                    disable={disabled}
                    options={rounds}
                    selectedValues={selected}
                    displayValue="name"
                    onSelect={handleSelectedRound}
                    onRemove={handleSelectedRound}
                    selectionLimit={1}
                    required
                />
            </div>
        </React.Fragment>
    );
};

export default SelectRounds;
