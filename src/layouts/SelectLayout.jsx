import React, {useEffect} from 'react';
import Loader from '../components/Loader';

const SelectLayout = props => {
    const {data, isInitialized, setActive, isUsers, setIsInitialized} = props;

    const handleSelect = e => {
        setActive(e.target.value);
        setIsInitialized(false);
    };

    useEffect(() => {
        if (!isUsers && data.length > 0) {
            const element = data[0];
            setActive(element.id);
        }
        return () => {
        };
    }, [data, setActive, isUsers]);
    return (
        <div className="form-group">
            {!isInitialized && data.length === 0 ? (
                <Loader/>
            ) : (
                <div id="custom-select">
                    <select onChange={handleSelect}>
                        {isUsers ? <option value="">Select Application</option> : ''}
                        {data.length > 0 ? (
                            data.map((element, index) => (
                                <option value={element.id} key={index}>
                                    {element.name}
                                </option>
                            ))
                        ) : (
                            <option value="">No data available</option>
                        )}
                    </select>
                </div>
            )}
        </div>
    );
};

export default SelectLayout;
