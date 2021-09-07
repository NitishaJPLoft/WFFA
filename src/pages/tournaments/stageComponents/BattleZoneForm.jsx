import React from 'react';
import DragToReorderTable from '../../../layouts/DragToReorderTable';
import DateFnsUtils from '@date-io/date-fns';
import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const BattleZoneForm = props => {
    const {
        battleError,
        rounds,
        players,
        roundForTBD,
        judges,
        members,
        setMembers,
        selectMember,
        selected,
        setCompetitors,
        setSeeds,
        seeds,
        setPlayers,
        setSelectedMembers,
        selectedMembers,
        battleRound,
        handleBattleForm,
        setBattledate,
        competitorArr,
        thirdbracket,
        thirdBattleRoundName,
        thirdBattleDescription,
        setThirdBattleRoundName,
        setThirdBattleDescription,
        topyaRoundNameForThird,
        topyaRoundDescriptionForThird,
        handleTopyaRoundNameForThird,
        handleTopyaRoundDescForThird,
        thirdBattleError,
        stageId
    } = props;

    const handleBattle = (e, index, type = '') => {
        let today = e,
            day = today.getDate(),
            month = today.getMonth() + 1, //January is 0
            year = today.getFullYear(),
            hrs = today.getHours(),
            mins = today.getMinutes();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        if (hrs < 10) {
            hrs = '0' + hrs;
        }
        if (mins < 10) {
            mins = '0' + mins;
        }
        today = year + '-' + month + '-' + day + 'T' + hrs + ':' + mins;
        let all = [...battleRound];

        if (type) {
            all[index].topyaRoundStartDate = today;
        } else {
            all[index].startDate = today;
        }
        setBattledate(all);
    };

    const tbd = index => {
        let rows = [];
        for (let i = 0; i < roundForTBD[index]; i++) {
            if (competitorArr && competitorArr.length && competitorArr[index - 1] && competitorArr[index - 1].length) {
                rows.push(
                    <tr key={'tbd_' + i}>
                        <td data-column="First Name">{competitorArr[index - 1][i] && competitorArr[index - 1][i].seeds ? competitorArr[index - 1][i].seeds : ''}</td>
                        <td data-column="Last Name">
                            {competitorArr[index - 1][i] && competitorArr[index - 1][i].competitorImage ?
                                <img alt="user" src={competitorArr[index - 1][i].competitorImage}/> : ''}
                            {
                                competitorArr[index - 1][i] && competitorArr[index - 1][i].competitorName ?
                                    competitorArr[index - 1][i].competitorName.length > 20 ?
                                    competitorArr[index - 1][i].competitorName.substring(0, 18) + '...' :
                                        competitorArr[index - 1][i].competitorName : ''
                            }
                        </td>
                        <td data-column="Job Title">
                            {
                                competitorArr[index - 1][i] && competitorArr[index - 1][i].competitorUsername ?
                                    competitorArr[index - 1][i].competitorUsername.length > 15 ?
                                    competitorArr[index - 1][i].competitorUsername.substring(0, 13) + '...' :
                                        competitorArr[index - 1][i].competitorUsername : ''
                            }
                        </td>
                        <td data-column="Twitter">
                            {
                                competitorArr[index - 1][i] && competitorArr[index - 1][i].competitorContry ?
                                    competitorArr[index - 1][i].competitorContry.length > 15 ?
                                    competitorArr[index - 1][i].competitorContry.substring(0, 13) + '...' :
                                        competitorArr[index - 1][i].competitorContry : ''
                            }

                        </td>
                    </tr>
                )
            } else {
                rows.push(
                    <tr key={'tbd_' + i}>
                        <td>{i + 1}</td>
                        <td>TBD</td>
                        <td>TBD</td>
                        <td>TBD</td>
                    </tr>
                );
            }
        }
        return rows;
    };

    return (
        <React.Fragment>
            <div className="col-md-12">
                <hr/>
            </div>
            <div id="accordion-style-1" className="container pl-0 final-sec">
                <div className="container pl-0">
                    <section>
                        <div className="row">
                            <div className="col-md-7">
                                <div id="accordionExample" className="accordion">
                                    {rounds && rounds.length && rounds.map((round, index) => {
                                        return (
                                            <div className="card" key={index}>
                                                <div id={round + '-' + index} className="card-header">
                                                    <h5 className="mb-0">
                                                        <button
                                                            style={{marginLeft: '10px'}}
                                                            type="button"
                                                            data-toggle="collapse"
                                                            data-target={'#' + round}
                                                            aria-expanded={index === 0}
                                                            aria-controls={round}
                                                            className="btn btn-link btn-block text-left"
                                                        >
                                                            {battleRound &&
                                                            battleRound.length &&
                                                            battleRound[index] &&
                                                            battleRound[index].name
                                                                ? battleRound[index].name
                                                                : null}
                                                            <i className="fa fa-chevron-down"/>
                                                        </button>
                                                    </h5>
                                                </div>
                                                <div
                                                    id={round}
                                                    aria-labelledby={round + '-' + index}
                                                    data-parent="#accordionExample"
                                                    className={
                                                        'collapse fade' + (index === 0 ? ' show' : '')
                                                    }
                                                >
                                                    <div className="card-body">
                                                        <div className="col-md-10">
                                                            <div className="form-group">
                                                                <label>
                                                                    Round Name
                                                                    <span style={{color: '#e63737'}}>*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="name"
                                                                    value={
                                                                        battleRound &&
                                                                        battleRound.length &&
                                                                        battleRound[index] &&
                                                                        battleRound[index].name
                                                                            ? battleRound[index].name
                                                                            : null
                                                                    }
                                                                    required
                                                                    onChange={e =>
                                                                        handleBattleForm(e, index)
                                                                    }
                                                                />
                                                                <span className="help-block error text-danger">
                                                                    {battleError.name ? battleError.name : ''}
                                                                </span>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>
                                                                    Round Description (optional)
                                                                </label>
                                                                <textarea
                                                                    className="form-control"
                                                                    rows="5"
                                                                    name="description"
                                                                    value={
                                                                        battleRound &&
                                                                        battleRound.length &&
                                                                        battleRound[index] &&
                                                                        battleRound[index].description
                                                                            ? battleRound[index].description
                                                                            : ''
                                                                    }
                                                                    onChange={e => handleBattleForm(e, index)}
                                                                    placeholder="Description"
                                                                />
                                                            </div>
                                                            {thirdbracket === 'yes' && (index === rounds.length - 1) ?
                                                                <React.Fragment>
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Third Round Name
                                                                            <span style={{color: '#e63737'}}>*</span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            name="name"
                                                                            value={thirdBattleRoundName}
                                                                            required
                                                                            onChange={e => setThirdBattleRoundName(e.target.value)}
                                                                        />
                                                                        <span className="help-block error text-danger">
                                                                        {thirdBattleError ? thirdBattleError : ''}
                                                                    </span>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Third Battle Round Description (optional)
                                                                        </label>
                                                                        <textarea
                                                                            className="form-control"
                                                                            rows="5"
                                                                            name="description"
                                                                            value={thirdBattleDescription}
                                                                            onChange={e => setThirdBattleDescription(e.target.value)}
                                                                            placeholder="Description"
                                                                        />
                                                                    </div>
                                                                    {stageId ? <React.Fragment>
                                                                        <div className="form-group">
                                                                            <label>
                                                                                Updated Topya Third Round Name
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                name="Topya Third Round Name"
                                                                                value={topyaRoundNameForThird}
                                                                                onChange={e => handleTopyaRoundNameForThird(e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>
                                                                                Updated Topya Third Battle Round
                                                                                Description
                                                                            </label>
                                                                            <textarea
                                                                                className="form-control"
                                                                                rows="5"
                                                                                name="description"
                                                                                value={topyaRoundDescriptionForThird}
                                                                                onChange={e => handleTopyaRoundDescForThird(e.target.value)}
                                                                                placeholder="Topya Third Battle Round Description"
                                                                            />
                                                                        </div>
                                                                    </React.Fragment> : ''}
                                                                </React.Fragment> : ''
                                                            }
                                                            <div className="form-group">
                                                                <label>Start Date</label>
                                                                <MuiPickersUtilsProvider
                                                                    utils={DateFnsUtils}
                                                                >
                                                                    <KeyboardDateTimePicker
                                                                        className="form-control"
                                                                        id="startDate"
                                                                        ampm={false}
                                                                        name="startDate"
                                                                        invalidDateMessage={null}
                                                                        value={
                                                                            battleRound &&
                                                                            battleRound.length &&
                                                                            battleRound[index] &&
                                                                            battleRound[index].startDate
                                                                                ? battleRound[index].startDate
                                                                                : null || ''
                                                                        }
                                                                        onChange={e => handleBattle(e, index)}
                                                                        format="MM-dd-yyyy HH:mm"
                                                                        minDate={new Date()}
                                                                        onKeyDown={e => e.preventDefault()}
                                                                    />
                                                                </MuiPickersUtilsProvider>
                                                                <span className="help-block error text-danger">
                                                                            {battleError.startDate ? battleError.startDate : ''}
                                                                        </span>
                                                            </div>
                                                            {stageId && battleRound[index].showUpdateTopya ?
                                                                <React.Fragment>
                                                                    <hr/>
                                                                    <h5 style={{color: 'green'}}>New Edited Topya Round
                                                                        Details </h5>
                                                                    <div className="form-group">
                                                                        <input type="checkbox" id="updateOnTopya"
                                                                               name="updateOnTopya"
                                                                               value={battleRound[index].updateOnTopya}
                                                                               onChange={e => handleBattleForm(e, index)}/>
                                                                        <label style={{
                                                                            width: '95%',
                                                                            float: 'right',
                                                                            marginTop: 0
                                                                        }} htmlFor="updateOnTopya">Create new duplicate
                                                                            battles over the TopYa </label>
                                                                    </div>
                                                                    {battleRound[index].updateOnTopya ? <React.Fragment>
                                                                        <div className="form-group">
                                                                            <label>Updated Topya Round Name</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                name="topyaRoundName"
                                                                                value={battleRound[index].topyaRoundName}
                                                                                onChange={e =>
                                                                                    handleBattleForm(e, index)
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>
                                                                                Updated Topya Round Description
                                                                            </label>
                                                                            <textarea
                                                                                className="form-control"
                                                                                rows="5"
                                                                                name="topyaRoundDescription"
                                                                                value={battleRound[index].topyaRoundDescription}
                                                                                onChange={e =>
                                                                                    handleBattleForm(e, index)
                                                                                }
                                                                                placeholder="Topya Round Description"
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>Updated Topya Start Date</label>
                                                                            <MuiPickersUtilsProvider
                                                                                utils={DateFnsUtils}
                                                                            >
                                                                                <KeyboardDateTimePicker
                                                                                    className="form-control"
                                                                                    id="topyaRoundStartDate"
                                                                                    ampm={false}
                                                                                    name="topyaRoundStartDate"
                                                                                    invalidDateMessage={null}
                                                                                    value={battleRound[index].topyaRoundStartDate}
                                                                                    onChange={e => handleBattle(e, index, 'topya')}
                                                                                    format="MM-dd-yyyy HH:mm"
                                                                                    onKeyDown={e => e.preventDefault()}
                                                                                />
                                                                            </MuiPickersUtilsProvider>
                                                                        </div>
                                                                    </React.Fragment> : ''}
                                                                </React.Fragment> : ''}

                                                            <hr/>
                                                            <h5>BattleZone Bracket Settings </h5>
                                                            <div className="form-group">
                                                                <label>
                                                                    Minimum Rounds (enter number, default =
                                                                    1)
                                                                    <span style={{color: '#e63737'}}>*</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    required
                                                                    min={1}
                                                                    name="minRound"
                                                                    value={
                                                                        battleRound &&
                                                                        battleRound.length &&
                                                                        battleRound[index] &&
                                                                        battleRound[index].minRound
                                                                            ? battleRound[index].minRound
                                                                            : null || 0
                                                                    }
                                                                    onChange={e =>
                                                                        handleBattleForm(e, index)
                                                                    }
                                                                    placeholder="1"
                                                                />
                                                                <span className="help-block error text-danger">
                                                                            {battleError.minRound ? battleError.minRound : ''}
                                                                        </span>
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="exampleFormControlInput1">
                                                                    Maximum Rounds (enter number or “no
                                                                    limit”, default = no limit)
                                                                    <span style={{color: '#e63737'}}>*</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    required
                                                                    name="maxRound"
                                                                    min={
                                                                        battleRound &&
                                                                        battleRound.length &&
                                                                        battleRound[index] &&
                                                                        battleRound[index].minRound
                                                                            ? battleRound[index].minRound
                                                                            : null
                                                                    }
                                                                    value={
                                                                        battleRound &&
                                                                        battleRound.length &&
                                                                        battleRound[index] &&
                                                                        battleRound[index].maxRound
                                                                            ? battleRound[index].maxRound
                                                                            : null || 0
                                                                    }
                                                                    onChange={e =>
                                                                        handleBattleForm(e, index)
                                                                    }
                                                                    placeholder="3"
                                                                />
                                                                <span className="help-block error text-danger">
                                                                            {battleError.maxRound ? battleError.maxRound : ''}
                                                                        </span>
                                                            </div>
                                                            <div className="form-group">
                                                                <label style={{display: 'block'}}>
                                                                    Time to Respond (enter number of hours,
                                                                    default = 48 hours)
                                                                    <span style={{color: '#e63737'}}>*</span>
                                                                </label>
                                                                <input
                                                                    style={{
                                                                        width: '60px',
                                                                        display: 'inline-block',
                                                                    }}
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="timeToRespond"
                                                                    required
                                                                    min={0}
                                                                    value={
                                                                        battleRound &&
                                                                        battleRound.length &&
                                                                        battleRound[index] &&
                                                                        battleRound[index].timeToRespond
                                                                            ? battleRound[index].timeToRespond
                                                                            : null || 0
                                                                    }
                                                                    onChange={e =>
                                                                        handleBattleForm(e, index)
                                                                    }
                                                                    placeholder="48"
                                                                />
                                                                <span> hours</span>
                                                                <span className="help-block error text-danger">
                                                                            {battleError.timeToRespond ? battleError.timeToRespond : ''}
                                                                        </span>
                                                            </div>
                                                            <div className="form-group">
                                                                <label style={{display: 'block'}}>
                                                                    Maximum Video Length
                                                                    <span style={{color: '#e63737'}}>*</span>
                                                                </label>
                                                                <input
                                                                    style={{
                                                                        width: '60px',
                                                                        display: 'inline-block',
                                                                    }}
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="maxVideoLength"
                                                                    required
                                                                    min={1}
                                                                    placeholder="30"
                                                                    value={
                                                                        battleRound &&
                                                                        battleRound.length &&
                                                                        battleRound[index] &&
                                                                        battleRound[index].maxVideoLength
                                                                            ? battleRound[index].maxVideoLength
                                                                            : null || 1
                                                                    }
                                                                    onChange={e =>
                                                                        handleBattleForm(e, index)
                                                                    }
                                                                />
                                                                <span> seconds</span>
                                                                <div>
                                                                            <span
                                                                                className="help-block error text-danger">
                                                                                {battleError.maxVideoLength ? battleError.maxVideoLength : ''}
                                                                            </span>
                                                                </div>
                                                            </div>
                                                            <hr/>
                                                            {judges[index]}
                                                            <span className="help-block error text-danger">
                                                                        {battleError.judge ? battleError.judge : ''}
                                                                    </span>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <hr/>
                                                            </div>
                                                        </div>
                                                        <h5>Competitors</h5>

                                                        {index === 0 ? (
                                                            <React.Fragment>
                                                                {selectedMembers &&
                                                                selectedMembers.length ? (
                                                                    <DragToReorderTable
                                                                        selectedMembers={selectedMembers}
                                                                        setSelectedMembers={
                                                                            setSelectedMembers
                                                                        }
                                                                        members={members}
                                                                        setMembers={setMembers}
                                                                        selectMember={selectMember}
                                                                        selected={selected}
                                                                        setCompetitors={setCompetitors}
                                                                        setSeeds={setSeeds}
                                                                        seeds={seeds}
                                                                        players={players}
                                                                        setPlayers={setPlayers}
                                                                    />
                                                                ) : (
                                                                    ''
                                                                )}

                                                                <div className="col-md-10 pl-0">
                                                                    {players}
                                                                </div>
                                                            </React.Fragment>
                                                        ) : (
                                                            <section>
                                                                <table>
                                                                    <thead>
                                                                    <tr>
                                                                        <th>Seed</th>
                                                                        <th>Name</th>
                                                                        <th>Username</th>
                                                                        <th>Country</th>
                                                                        <th/>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>{tbd(index)}</tbody>
                                                                </table>
                                                            </section>
                                                        )}
                                                        <span className="help-block error text-danger">
                                                                {battleError.players ? battleError.players : ''}
                                                            </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </React.Fragment>
    );
};

export default BattleZoneForm;
