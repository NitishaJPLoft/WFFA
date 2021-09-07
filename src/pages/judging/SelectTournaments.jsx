import React from 'react';
import { Multiselect } from 'multiselect-react-dropdown';

const SelectTournaments = props => {
    const {tournaments, handleSelectedTournament, selected, disabled} = props;

    return (
        <React.Fragment>
            <div id="custom-select">
                <Multiselect
                    options={tournaments}
                    selectedValues={selected}
                    displayValue="name"
                    disable={disabled}
                    onSelect={handleSelectedTournament}
                    onRemove={handleSelectedTournament}
                    selectionLimit={1}
                    required
                />
            </div>
        </React.Fragment>
    );
};

export default SelectTournaments;
