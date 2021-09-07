import React from 'react';
import {useSnackbar} from "notistack";

const SelectJudges = (props) => {
    const {enqueueSnackbar} = useSnackbar();
    const {selected, groups, setGroups, users} = props;

    const handleChange = (value) => {
        let dataArr = [...groups];

        if (groups.includes(value)) {
            enqueueSnackbar('This judge is already selected', {
                variant: 'error',
                autoHideDuration: 3000
            });
        } else {
            groups.push(value);
            setGroups(dataArr);
        }
    };

    return (
        <React.Fragment>
            <div id="custom-select">
                <select onChange={e => handleChange(e.target.value)} value={selected}>
                    <option value="">Select</option>
                    {users.length > 0
                        ? users.map((user, index) => (
                            <option
                                value={user.id}
                                key={index}
                            >
                                {user.firstName + (user.lastName ? ' ' + user.lastName : '')}
                            </option>
                        ))
                        : ''}
                </select>
            </div>
        </React.Fragment>
    );
};

export default SelectJudges;
