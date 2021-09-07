import React from 'react';

const InputPlayers = props => {
    const {users, index, selectMember, selected} = props;
    return (
        <div className="form-group">
            <label htmlFor="exampleFormControlInput1"/>
            <span>{index}</span>
            <div id="custom-select">
                <select value={selected} onChange={(e) => selectMember(index, e.target.value)}>
                    <option value="">Select</option>
                    {users.length > 0
                        ? users.map((user, index) => {
                            return <option
                                value={JSON.stringify(user)}
                                key={index}
                            >
                                {user.score ? (user.score + ', ') : ''} {user.countryCode ? (user.countryCode + ', '): ''} {user.displayName}
                            </option>
                        })
                        : ''}
                </select>
            </div>
        </div>
    );
};

export default InputPlayers;
