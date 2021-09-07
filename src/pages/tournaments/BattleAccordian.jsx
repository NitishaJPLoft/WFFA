import React, {useEffect, useState} from 'react';
import user from '../../images/user.png';
import {helpers} from '../../helper/helper';
import img from '../../images/user.png';
import ReactImageFallback from 'react-image-fallback';
import {useSnackbar} from 'notistack';
import { useHistory} from 'react-router-dom';

const imageList = [user];

imageList.forEach(image => {
    new Image().src = image;
});

const BattleAccordian = props => {
    const {rounds, capitalizeWord, competitorLength, stageType , stageId} = props;
    const [battles, setBattles] = useState([]);
    const [check, setCheck] = useState();
    const [checks, setChecks] = useState();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        const value = competitorLength;
        if (stageType === 'battle' && value) {
            const x = Math.log(value) / Math.log(2);
            const roundArr = [];
            for (let i = x; i > 0; i--) {
                const y = Math.pow(2, i);
                roundArr.push(y > 8 ? y : y === 8 ? 'Quarter Final' : y === 4 ? 'Semi Final' : 'Final');
            }
            setBattles(roundArr);
        }
        if (stageType === 'pool' && rounds && rounds.length) {
            const roundArr = [];
            for (const obj of rounds) {
                roundArr.push(obj.name);
            }
            setBattles(roundArr);
        }
    }, [rounds, competitorLength]);

    const changeRoundWinnerStatus = async (e, roundId , roundname) => {
        
        e.preventDefault();
        const url =
            process.env.REACT_APP_API_URI + 'tournament/enableroundwinner';
        let formData = new FormData();
        formData.append('stageId', stageId);
        formData.append('roundId', roundId);
        const response = await helpers.formDataMultipart('POST', url, formData);

        if (response.status === 200) {
            enqueueSnackbar(response.message, {
                variant: 'success',
                autoHideDuration: 3000
            });
            if(check=="0")
            {
                setCheck(1)
            }
            else
            {
                setCheck(0)
            }
           
            
            
            
            
        } else {
            if (response.status === 401) {
                localStorage.clear();
                history.push('/login');
            } else {
                enqueueSnackbar(response.message, {
                    variant: 'error',
                    autoHideDuration: 3000
                });
            }
            
        }
    };

    useEffect(() => {
       if(check === 0){
setChecks("display")
       }else if (check === 1){
        setChecks("hide")
       }
    }, [check , setChecks]);

    

    return (
        <div id="accordion-style-2" className="container pl-0 final-sec">
            <div className="container pl-0">
                <section>
                    <div className="row">
                        <div className="col-md-12">
                            <div id="accordionExample1" className="accordion">
                                {battles && battles.length
                                    ? battles.map((battle, index) => {
                                        const text = rounds[index] && capitalizeWord(rounds[index].roundName || rounds[index].name);
                                        return (
                                            <div className="card" key={index}>
                                                <div
                                                    id={battle + '-' + index}
                                                    className="card-header"
                                                >
                                                    <h5 className="mb-0">
                                                        <button
                                                            type="button"
                                                            data-toggle="collapse"
                                                            data-target={'#' + battle}
                                                            aria-expanded={index === 0}
                                                            aria-controls={battle}
                                                            className="btn btn-link btn-block text-left"
                                                            style={{textDecoration: 'none'}}
                                                        >
                                                            {text} <i className="fa fa-chevron-down"/>
                                                        </button>
                                                    </h5>
                                                </div>
                                                <div
                                                    id={battle}
                                                    aria-labelledby={battle + '-' + index}
                                                    data-parent="#accordionExample1"
                                                    className={
                                                        'collapse fade' + (index === 0 ? ' show' : '')
                                                    }
                                                >
                                                    <div className="card-body">

                                                        {rounds[index] !== undefined ? (

                                                            <React.Fragment>

                                                                <p>
                                                                    <strong>Name: </strong>
                                                                    {rounds[index] && capitalizeWord(rounds[index].roundName || rounds[index].name)}
                                                                </p>
                                                                <p>
                                                                    <strong>Description: </strong>
                                                                    {rounds[index].roundDescription}
                                                                </p>
                                                                <p>
                                                                    <strong>Start Date: </strong>
                                                                    {rounds[index].startDate ? helpers.getParsedDate(rounds[index].startDate) : ''}
                                                                </p>
                                                                <p>
                                                                    <strong>Minimum Rounds: </strong>
                                                                    {rounds[index].minRound}
                                                                </p>
                                                                <p>
                                                                    <strong>Maximum Rounds: </strong>
                                                                    {rounds[index].maxRound}
                                                                </p>
                                                                <p>
                                                                    <strong>
                                                                        Number of Hours to Respond:{' '}
                                                                    </strong>
                                                                    {rounds[index].timeOfResponed
                                                                        ? rounds[index].timeOfResponed + ' Hours'
                                                                        : ''}
                                                                </p>
                                                                <p>
                                                                    <strong>Maximum Video Length: </strong>
                                                                    {rounds[index].maxVideoLength}
                                                                </p>
                                                                {stageType === 'pool'?
                                                                <button
                                                                    style={{width: '250px', marginLeft: 0, marginRight: '10px', marginBottom: 0}}
                                                                    className="main-btn text-center"
                                                                    onClick={e =>
                                                                        changeRoundWinnerStatus(e, rounds[index].roundId , rounds[index].displayWinner)
                                                                    }
                                                                >
                                                                    {checks === "hide"  ? 'Hide' : 'Display '} Round Winners
                                                                </button>
                                                                :''}
                                                                {stageType === 'battle' ? <React.Fragment>
                                                                    <hr/>
                                                                    <p>
                                                                        <strong>Judges</strong>
                                                                    </p>
                                                                    {rounds[index].judges && rounds[index].judges.length ? (
                                                                        rounds[index].judges.map((judge, index) => {
                                                                            return (
                                                                                <p key={index}>
                                                                                    {judge.displayName
                                                                                        ? judge.displayName
                                                                                        : judge.fullName}
                                                                                </p>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <p>none assigned</p>
                                                                    )}
                                                                </React.Fragment> : ''}

                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <hr/>
                                                                    </div>
                                                                </div>
                                                                {rounds[index].competitors &&
                                                                rounds[index].competitors.length ? (
                                                                    <React.Fragment>
                                                                        <h5>Competitors</h5>
                                                                        <table>
                                                                            <thead>
                                                                            <tr>
                                                                                <th style={{width: '70px'}}>
                                                                                    Seed
                                                                                </th>
                                                                                <th>Name</th>
                                                                                <th>Username</th>
                                                                                <th>Country</th>
                                                                            </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                            {rounds[index].competitors.map(
                                                                                (competitor, index) => {
                                                                                    return (
                                                                                        <tr key={index}>
                                                                                            <td
                                                                                                data-column="First Name"
                                                                                                style={{
                                                                                                    textAlign: 'center',
                                                                                                }}
                                                                                            >
                                                                                                {competitor.seeds ? competitor.seeds : index + 1}
                                                                                            </td>
                                                                                            <td data-column="First Name">
                                                                                                <ReactImageFallback
                                                                                                    src={
                                                                                                        competitor.avatarURL
                                                                                                            ? competitor.avatarURL
                                                                                                            : user
                                                                                                    }
                                                                                                    fallbackImage={img}
                                                                                                    alt="user"
                                                                                                />
                                                                                                {competitor.displayName
                                                                                                    ? competitor.displayName
                                                                                                        .length > 25
                                                                                                        ? competitor.displayName.substring(0, 23) + '...'
                                                                                                        : competitor.displayName
                                                                                                    : ''}
                                                                                            </td>
                                                                                            <td data-column="Job Title">
                                                                                                {competitor.username
                                                                                                    ? competitor.username
                                                                                                        .length > 20
                                                                                                        ? competitor.username.substring(0, 18) + '...'
                                                                                                        : competitor.username
                                                                                                    : ''}
                                                                                            </td>
                                                                                            <td data-column="Twitter">
                                                                                                {competitor.country
                                                                                                    ? competitor.country
                                                                                                        .length > 15
                                                                                                        ? competitor.country.substring(0, 13) + '...'
                                                                                                        : competitor.country
                                                                                                    : ''}
                                                                                            </td>
                                                                                        </tr>
                                                                                    );
                                                                                }
                                                                            )}
                                                                            </tbody>
                                                                        </table>
                                                                    </React.Fragment>
                                                                ) : null}
                                                            </React.Fragment>
                                                        ) : (
                                                            'TBD'
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                    : null}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BattleAccordian;
