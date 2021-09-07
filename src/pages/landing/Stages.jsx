import React, {useEffect, useState, useCallback} from 'react';
import './landingStyle.css';
import {BASE_URL, apiCall} from '../../helper/fetch';
import {useHistory} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import LoaderLayout from '../../layouts/LoaderLayout';

import Stagebattle from './Stagebattle';

const Stages = () => {
    const full = window.location.href;
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [isLoading, setIsLoading] = useState(true);
    const [headerleft, setHeaderleft] = useState(null);
    const [headerright, setHeaderright] = useState(null);
    const [countryflag, setCountryflag] = useState(null);
    const [tournamentname, setTournamentname] = useState('');
    const [stages, setStages] = useState([]);
    const [landing, setLanding] = useState(null);
    const [active, setActive] = useState(0);

    const [footer, setFooter] = useState([]);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        if (stages && stages.length) {
            if (stages.length > 1 && stages[0].status === 4) {
                setActive(1);
            }
        }
    }, [stages.length]);

    const getOrganizations = useCallback(async () => {
        const url = BASE_URL + 'landingpage?url=' + full;

        const data = await apiCall('GET', url);
        if (data.status === 200) {
            setLanding(data.data);
            setStages(data.data.stages);
            setHeaderleft(data.data.landing_page_logo_left);
            setHeaderright(data.data.landing_page_logo_right);
            setCountryflag(data.data.countryflag);
            setTournamentname(data.data.tournamentName);

            setFooter(JSON.parse(data.data.footer));
        } else {
            if (data.status === 401) {
                history.push('/login');
            } else {
                enqueueSnackbar(data.message, {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
            }
        }
        setIsLoading(false);
    }, [enqueueSnackbar, full, history]);

    useEffect(() => {
        getOrganizations();
    }, [getOrganizations]);

    const handleClick = (e, i) => {
        setActive(i);
    };

    return (
        <React.Fragment>
            {isLoading ? (
                <LoaderLayout/>
            ) : (
                <div className="landingPage">
                    <nav className="header">
                        <div className="row">
                            <div className="col-md-4">
                                <a href={landing && landing.landing_page_link_left ? landing.landing_page_link_left : '#'}
                                   target="blank">
                                    <img
                                        src={headerleft ? headerleft : ''}
                                        className='imglanding'
                                        alt=""
                                    />
                                </a>
                            </div>
                            <div className="col-md-4 text-center">
                                {countryflag ? (
                                    <div className="flag">
                                        <embed className="countryflag" src={countryflag}/>
                                    </div>
                                ) : null}
                            </div>
                            <div className="col-md-4 " style={{textAlign: 'right'}}>
                                <a href={landing && landing.landing_page_link_right ? landing.landing_page_link_right : '#'}
                                   target="blank">
                                    <img
                                        className='imglanding'
                                        src={headerright ? headerright : ''}
                                        alt=""
                                    />
                                </a>
                            </div>
                        </div>
                    </nav>
                    <div className="container-fluid main-d dashboard permision about">
                        <h1 style={{border: 'none'}}>
                            {tournamentname} <br/>{' '}
                        </h1>
                        <div className="tab-content">
                            {stages
                                ? stages.map((data, index) => (
                                    <div
                                        key={index}
                                        role="tabpanel"
                                        className={
                                            'tab-pane text-center ' +
                                            (active === index ? 'active' : '')
                                        }
                                        id={'landing' + index}
                                    >
                                        {data.stageType === 'skill' && data.status === 1 ? (
                                            <React.Fragment>
                                                <h2>
                                                    Stage {index + 1} Competition{' '}
                                                    {months[new Date(new Date(data.startDate.replace(' ', 'T'))).getMonth()]}{' '}
                                                    {new Date(data.startDate.replace(' ', 'T')).getDate()} - {' '}
                                                    {months[new Date(data.endDate.replace(' ', 'T')).getMonth()]}{' '}
                                                    {new Date(data.endDate.replace(' ', 'T')).getDate()}
                                                </h2>
                                                <br/>
                                                <a href="#footerdown" style={{textDecoration: 'none'}}>
                                                    <h3>Join the Competition</h3>
                                                </a>
                                            </React.Fragment>
                                        ) : data.stageType === 'skill' && (data.status === 2 || data.status === 3 || data.status === 4) ? (
                                            <React.Fragment>
                                                <h2>
                                                    Stage {index + 1} Competition{' '}
                                                    {months[new Date(new Date(data.startDate.replace(' ', 'T'))).getMonth()]}{' '}
                                                    {new Date(data.startDate.replace(' ', 'T')).getDate()} - {' '}
                                                    {months[new Date(data.endDate.replace(' ', 'T')).getMonth()]}{' '}
                                                    {new Date(data.endDate.replace(' ', 'T')).getDate()}
                                                </h2>
                                                <br/>
                                                <h3>Stage {index + 1} is Complete</h3>
                                            </React.Fragment>
                                        ) : (data.stageType === 'battle') && data.status === 1 ? (
                                            <React.Fragment>
                                                <h2>
                                                    Stage {index + 1} BattleZone Competition begins {' '}
                                                    {data.startDate ? months[new Date(data.startDate.replace(' ', 'T')).getMonth()] : ''}{' '}
                                                    {data.startDate ? new Date(data.startDate.replace(' ', 'T')).getDate() : ''}
                                                </h2>
                                                <br/>
                                                <a href="#footerdown" style={{textDecoration: 'none'}}>
                                                    <h3>Follow the Battles</h3>
                                                </a>
                                            </React.Fragment>
                                        ) : (data.stageType === 'battle') && (data.status === 2 || data.status === 3 || data.status === 4) ? (
                                            <React.Fragment>
                                                <h2>
                                                    Stage {index + 1} BattleZone{' '}
                                                    {data.startDate ? months[new Date(data.startDate.replace(' ', 'T')).getMonth()] : ''}{' '}
                                                    {data.startDate ? new Date(data.startDate.replace(' ', 'T')).getDate() : ''}
                                                </h2>
                                                <br/>
                                                <h3>Stage {index + 1} is Complete</h3>
                                            </React.Fragment>
                                        ) : data.stageType === 'pool' && data.status === 1 ? (
                                            <React.Fragment>
                                                
                                                <h2>
                                                   {data.stageName?data.stageName:''}  Battle Pool Competition begins {' '}
                                                    {data.startDate ? months[new Date(data.startDate.replace(' ', 'T')).getMonth()] : ''}{' '}
                                                    {data.startDate ? new Date(data.startDate.replace(' ', 'T')).getDate() : ''}
                                                </h2>
                                                <br/>
                                                <a href="#footerdown" style={{textDecoration: 'none'}}>
                                                    <h3>Follow the Battles</h3>
                                                </a>
                                            </React.Fragment>
                                        ) : data.stageType === 'pool' && (data.status === 2 || data.status === 3 || data.status === 4) ? (
                                            <React.Fragment>
                                                
                                                <h2>
                                                {data.stageName?data.stageName:''} Battle Pool{' '}
                                                    {data.startDate ? months[new Date(data.startDate.replace(' ', 'T')).getMonth()] : ''}{' '}
                                                    {data.startDate ? new Date(data.startDate.replace(' ', 'T')).getDate() : ''}
                                                </h2>
                                                <br/>
                                                <h3>{data && data.stageName?data.stageName:''} is Complete</h3>
                                            </React.Fragment>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                ))
                                : ''}
                        </div>
                        <div className="demo">
                            <div role="tabpanel">
                                <ul className="nav nav-tabss" role="tablist">
                                    {stages
                                        ? stages.map((data, i) =>
                                            stages.length === 1 ? null : (
                                                <li
                                                    key={i}
                                                    role="presentation"
                                                    className="active"
                                                    style={{margin: '10px'}}
                                                >
                                                    <a style={{
                                                        backgroundColor: active === i ? '#E51A4F' : '',
                                                        color: active === i ? 'white' : '',
                                                    }}
                                                       className={'#landing' + i}
                                                       href={'#landing' + i}
                                                       aria-controls={'landing' + i}
                                                       role="tab"
                                                       data-toggle="tab"
                                                       onClick={e => handleClick(e, i)}
                                                    >
                                                        {/* Stage {i + 1} */}
                                                        {data.stageName}
                                                    </a>
                                                </li>
                                            )
                                        )
                                        : ''}
                                </ul>
                                <Stagebattle stages={stages} active={active} landing={landing} />
                            </div>
                        </div>

                        <div className="foter">
                            <div className="app-dwd-btn">
                                {footer.map((data, i) => (
                                    <a key={'footer_' + i} href={data.link} target="blank">
                                        {data.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};
export default Stages;
