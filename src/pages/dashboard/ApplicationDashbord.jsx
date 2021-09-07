import React, {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import CardLayout from '../../layouts/CardLayout';
import SelectLayout from '../../layouts/SelectLayout';
import LoaderLayout from '../../layouts/LoaderLayout';
import Loader from '../../components/Loader';
import {helpers} from '../../helper';
import {useSnackbar} from 'notistack';
import {BASE_URL, apiCall} from '../../helper/fetch';

const AdminDashboard = () => {
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const [isLoader, setIsLoader] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [cards, setCards] = useState([]);
    const [apps, setApps] = useState([]);
    const appId = localStorage.getItem('appId');
    const [isLoading, setIsLoading] = useState(false);
    const roleId = localStorage.getItem('roleId');
    const [activeApp, setActiveApp] = useState(null);
    const [active, setactive] = useState('');
    const [skill, setSkill] = useState('');
    const [battle, setBattle] = useState('');
    const [skilldate, setSkilldate] = useState('');
    const [battledate, setBattledate] = useState('');

    const getApps = useCallback(async () => {
        const response = await helpers.app('GET');
        if (response.status === 200) {
            setApps(response.data);
            setIsInitialized(true);
            setIsLoader(false);
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
    }, [enqueueSnackbar, history]);


    const getReports = useCallback(async () => {
        setIsLoading(true);
        const url = BASE_URL + 'applicationDashboard?app_id=' + activeApp;
        const response = await apiCall('GET', url);
        if(response.status === 200){
            setactive(response.data.tournament);
            setIsInitialized(true);
            setSkill(response.data.skill);
            setBattle(response.data.battle);
            setSkilldate(response.data.skilldate);
            setBattledate(response.data.battledate);
           
        } else {
            enqueueSnackbar(response.message, {
                variant: 'error',
                autoHideDuration: 3000
            });
            if (response.status === 401) {
                localStorage.clear();
                history.push('/login');
            }
        }
        setIsLoading(false);
    },[enqueueSnackbar, history,activeApp ]);

    useEffect( () => {
        if (!appId) {
            history.push('/system-dashboard');
        } else {
            if (roleId === '3') {
                history.push('/organisation-dashboard');
            } else if (roleId === '4') {
                history.push('/judge-dashboard');
            } else {
                history.push('/application-dashboard');
            }
        }
    }, [appId, roleId, history]);

    const getReport = useCallback(async () => {
        setCards([
            {
                name: 'Active Tournaments',
                count: `${active}`,
                title1: '\xa0',
            },
            {
                name: 'Skills Judging',
                title1: `${skilldate}`,
                count: `${skill}`,
            },
            {
                name: 'BattleZone Judging',
                title1: `${battledate}`,
                count: `${battle}`,
            },
        ]);
    }, [active,skill,battle, skilldate,battledate]);

    useEffect(() => {
        if (activeApp) {
            getReport();
            getReports();
        }

        if (!isInitialized) {
            getApps();
        }
    }, [isInitialized, setIsLoader, getApps, activeApp, getReport, getReports,
    ]);

    return (
            isLoader ? (
                <LoaderLayout/>
            ) : (
                <AppLayout>
                <div className="main-d dashboard">
                    <div className="container">
                        <h1> Dashboard</h1>

                        <div className="row m-5">
                            <div className="col-md-4"/>
                            <div className="col-md-4 text-center">
                                <SelectLayout
                                    type="Tournament"
                                    data={apps}
                                    isInitialized={isInitialized}
                                    setActive={setActiveApp}
                                    setIsInitialized={setIsInitialized}
                                />
                            </div>
                            <div className="col-md-4"/>
                        </div>

                        {isLoading ? (
                            <Loader/>
                        ) : (
                            <CardLayout cards={cards} active={activeApp}/>
                        )}
                    </div>
                </div>
                </AppLayout>
            )
        
    );
};

export default AdminDashboard;
