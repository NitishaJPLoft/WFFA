import React, {useCallback, useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {useSnackbar} from "notistack";
import {BASE_URL, apiCall} from '../../helper/fetch';

const SelectCountry = props => {
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const {handleSelectedCountry, selected, required} = props;
    const [isInitialized, setIsInitialized] = useState(false);
    const [country, setCountry] = useState([]);
    const getCountry = useCallback(async () => {
        const url = BASE_URL + 'tournament/country';
        const data = await apiCall('GET', url);
        if (data.status === 200) {
            setCountry(data.data);
            setIsInitialized(true);
        } else {
            enqueueSnackbar(data.message, {
                variant: 'error',
                autoHideDuration: 3000
            });
            if (data.status === 401) {
                history.push('/login');
            }
        }
    }, [enqueueSnackbar, history]);
    useEffect(() => {
        if (!isInitialized) {
            getCountry();
        }
    }, [isInitialized, getCountry]);
    return (
        <div id="custom-select">
            <select onChange={handleSelectedCountry} value={selected} required={required}>
                <option value="">Country List</option>
                {country.length > 0
                    ? country.map((country, index) => (
                        <option
                            value={country.id}
                            key={index}
                        >
                            {country.name}
                        </option>
                    ))
                    : ''}
            </select>
        </div>
    );
};

export default SelectCountry;
