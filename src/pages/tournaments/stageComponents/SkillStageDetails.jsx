import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const SkillStageDetails = (props) => {
    const {startDate, handleTn4, todayDate, sdateError, endDate, handleTn5, edateError, videoLength, handleTn2, videoError} = props;
    return (
        <React.Fragment>
            <div className="form-group">
                <label htmlFor="startDate">
                    Start Date<span style={{color: '#e63737'}}>*</span>
                </label>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDateTimePicker
                        className="form-control"
                        id="startDate"
                        ampm={false}
                        invalidDateMessage={null}
                        value={startDate}
                        onChange={handleTn4}
                        format="MM-dd-yyyy HH:mm"
                        minDate={todayDate}
                        onKeyDown={e => e.preventDefault()}
                        required
                    />
                </MuiPickersUtilsProvider>

                <span className="help-block error text-danger">
                    {sdateError ? sdateError : ''}
                </span>
            </div>
            <div className="form-group">
                <label htmlFor="datetime-local">
                    End Date<span style={{color: '#e63737'}}>*</span>
                </label>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDateTimePicker
                        className="form-control"
                        id="startDate"
                        ampm={false}
                        disabled={!startDate}
                        invalidDateMessage={null}
                        value={endDate}
                        onChange={handleTn5}
                        format="MM-dd-yyyy HH:mm"
                        minDate={startDate}
                        onKeyDown={e => e.preventDefault()}
                        required
                    />
                </MuiPickersUtilsProvider>
                <span className="help-block error text-danger">
                    {edateError ? edateError : ''}
                </span>
            </div>
            <div className="form-group">
                <label
                    style={{display: 'block'}}
                    htmlFor="videoLength"
                >
                    Maximum Video Length
                    <span style={{color: '#e63737'}}>*</span>
                </label>
                <input
                    style={{width: '75px', display: 'inline-block'}}
                    type="number"
                    className="form-control"
                    name="videoLength"
                    value={videoLength}
                    required
                    pattern="^-?[0-7]\d*\.?\d*$"
                    onKeyDown={e =>
                        (e.keyCode === 69 || e.keyCode === 190) &&
                        e.preventDefault()
                    }
                    onChange={handleTn2}
                />
                <span> seconds</span>
                <br/>
                <span className="help-block error text-danger">
                    {videoError ? videoError : ''}
                </span>
            </div>
        </React.Fragment>
    );
};

export default SkillStageDetails;
