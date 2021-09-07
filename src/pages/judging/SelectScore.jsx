import React from 'react';

const SelectScore = props => {
    const {onChange, error, player1, skill} = props;

    return (
        <React.Fragment>
            {skill ? <div className="col-md-2 text-right pr-0 mt-2">
                <h6 className="font-weight-bold">Score</h6>
            </div> : ''}
            {player1 ? <div className="col-md-1">
                {/*<h6 className="font-weight-bold">Score</h6>*/}
            </div> : ''}
            <div className={skill ? 'col-md-4' : 'col-md-5'}>
                <div className="form-group">
                    {skill ? '' : <h6 className="font-weight-bold" style={{textAlign: 'left'}}>Score</h6>}
                    <div id="custom-select">
                        <select onChange={onChange}>
                            <option>Select 1-10</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    </div>

                    <span className="help-block error text-danger">
                        {error ? error : ''}
                    </span>
                </div>
            </div>
        </React.Fragment>
    );
};

export default SelectScore;
