import React, {useState} from 'react';
import {useSnackbar} from "notistack";

const SelectUsers = props => {
    const {enqueueSnackbar} = useSnackbar();
    const {selected, groups, setGroups, index, users, userIndex, battleRound, setBattleRound} = props;
    const [selectedField, setSelectedField] = useState('');

    const handleChange = (value) => {
        let dataArr = [...groups];

        const indexVal = dataArr.findIndex((elem) => {
            return elem.groupName === index + 1;
        });
        if (indexVal > -1) {
            if (value !== "" && dataArr[indexVal] && dataArr[indexVal].judges && dataArr[indexVal].judges.includes(parseInt(value, 10))) {
                setSelectedField('');
                dataArr[indexVal].judges[userIndex] = '';
                setGroups(dataArr);
                enqueueSnackbar('This judge is already selected', {
                    variant: 'error',
                    autoHideDuration: 2000
                });
            } else {
                if (value !== '') {
                    if (battleRound && battleRound.length) {
                        let all = [...battleRound];

                        all[index].judge = dataArr[index].judges;
                        setBattleRound(all);
                    }
                    dataArr[indexVal].judges[userIndex] = parseInt(value, 10);
                    setSelectedField(value);
                    setGroups(dataArr);
                } else {
                    if (battleRound && battleRound.length) {
                        let all = [...battleRound];

                        all[index].judge = value;
                        setBattleRound(all);
                    }
                    setSelectedField('');
                    dataArr[indexVal].judges[userIndex] = '';
                    setGroups(dataArr);
                }
            }
        }
    };

    return (
        <React.Fragment>
            <div id="custom-select">
                <select onChange={e => handleChange(e.target.value)} value={selected || selectedField}>
                    <option value="">Select</option>
                    {users.length > 0
                        ? users.map((user, index) => (
                            <option
                                value={user.id}
                                key={index}
                            >
                                {user.displayName ? user.displayName : user.firstName + (user.lastName ? ' ' + user.lastName : '')}
                            </option>
                        ))
                        : ''}
                </select>
            </div>
        </React.Fragment>
    );
};

export default SelectUsers;
