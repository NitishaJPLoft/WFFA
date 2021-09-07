import React, {useEffect, useState, useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import CardLayout from '../../layouts/CardLayout';
import SelectLayout from '../../layouts/SelectLayout';
import LoaderLayout from '../../layouts/LoaderLayout';
import Loader from '../../components/Loader';
import {helpers} from '../../helper';
import {BASE_URL, apiCall} from '../../helper/fetch';
import {useSnackbar} from 'notistack';
import {Link} from 'react-router-dom';

const SystemAdminDashboard = () => {
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const [isLoader, setIsLoader] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [cards, setCards] = useState([]);
    const [apps, setApps] = useState([]);
    const [activeApp, setActiveApp] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const getApps = useCallback(async () => {
        const response = await helpers.app('GET', '', '', 'all');
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
                    autoHideDuration: 3000,
                });
            }
        }
    }, [enqueueSnackbar, history]);

    const getReport = useCallback(async () => {
        setIsLoading(true);
        const url = BASE_URL + 'permission/report?app_id=' + activeApp;
        const response = await apiCall('GET', url);
        if (response.status === 200) {
            setCards(response.data.permission);
        } else {
            enqueueSnackbar(response.message, {
                variant: 'error',
                autoHideDuration: 3000,
            });
            if (response.status === 401) {
                localStorage.clear();
                history.push('/login');
            }
        }
        setIsLoading(false);
    }, [activeApp, enqueueSnackbar, history]);
    useEffect(() => {
        if (activeApp) {
            getReport();
        }
        if (!isInitialized) {
            getApps();
        }
    }, [
        isInitialized,
        setIsInitialized,
        setIsLoader,
        getApps,
        activeApp,
        getReport,
    ]);

    return isLoader ? (
        <LoaderLayout/>
    ) : (
        <AppLayout>
            <div className="main-d dashboard">
                <div className="container">
                    <h1 className="d-flex justify-content-between">
                        Dashboard
                        <Link to="system-dashboard/sync">
                            <button
                                style={{textDecoration: 'none'}}
                                type="button"
                                className="btn btn-primary m-0"
                            >
                                Configuration
                            </button>
                        </Link>
                    </h1>

                    <div className="d-flex justify-content-end">
                        <div
                            className="btn-group"
                            role="group"
                            aria-label="Basic example"
                        />
                    </div>
                    <div className="row m-5">
                        <div className="col-md-4"/>
                        <div className="col-md-4 text-center">
                            <SelectLayout
                                type="Application"
                                data={apps}
                                isInitialized={isInitialized}
                                setActive={setActiveApp}
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
    );
};

export default SystemAdminDashboard;
