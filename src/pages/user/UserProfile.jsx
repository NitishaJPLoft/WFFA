import React, {useEffect, useState, useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import LoaderLayout from '../../layouts/LoaderLayout';
import {useSnackbar} from 'notistack';
import {helpers} from "../../helper";
import SingleRow from "../system/users/SingleRow";

const UserProfile = () => {
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [isLoader, setIsLoader] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [user, setUser] = useState({});
    const appId = localStorage.getItem('appId');

    const getUser = useCallback(async (id) => {
        setIsLoader(true);
        const data = await helpers.userDetails('GET', id, appId);
        if (data.status === 200) {
            setUser(data.data);
            setIsInitialized(true);
        } else {
            if (data.status === 401) {
                history.push('/login');
            } else {
                enqueueSnackbar(data.message, {
                    variant: 'error',
                    autoHideDuration: 3000
                });
            }
        }
        setIsLoader(false);
    }, [enqueueSnackbar, history, appId]);

    useEffect(() => {
        if (!isInitialized) {
            setIsLoader(false);
            if (localStorage.getItem('user')) {
                const data = JSON.parse(localStorage.getItem('user'));
                // setUser(data);
                getUser(data.id);
            } else {
                enqueueSnackbar('unauthorized', {
                    variant: 'error',
                    autoHideDuration: 3000
                });
                history.push('/login');
            }
            setIsInitialized(true);
        }
    }, [isInitialized, isLoader, getUser, enqueueSnackbar, history]);

    return (

        isLoader ? (
            <LoaderLayout/>
        ) : (
            <AppLayout>
                <div className="main-d dashboard permision">
                    <div className="container">
                        <h1>My Profile</h1>
                        <div className="mb-5">
                            <SingleRow user={user} noEdit={true}/>
                        </div>
                    </div>
                </div>
            </AppLayout>
        )

    );
};

export default UserProfile;
