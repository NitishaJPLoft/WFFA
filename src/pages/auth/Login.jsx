import React, {useCallback, useEffect, useState} from 'react';
import psl from 'psl';

import AuthLayout from '../../layouts/auth/AuthLayout';
import {helpers} from "../../helper";
import LoaderLayout from "../../layouts/LoaderLayout";

const Login = () => {
    const [isLoader, setIsLoader] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [loginLogo, setLoginLogo] = useState();
    const [showLogo, setShowLogo] = useState(false);
    const [forgotRoute, setForgotRoute] = useState('');
    const [showForget, setShowForget] = useState(false);

    const getSiteId = useCallback(async () => {
        const parsed = psl.parse(window.location.hostname);
        const subdomain = parsed.subdomain;
        const response = await helpers.getSiteId('POST', {subdomain});
        if (response.status === 200) {
            setIsInitialized(true);
            setIsLoader(false);
            setShowLogo(true);
            setForgotRoute('/forgot-password');
            setLoginLogo(response.data.login_logo);

            response.data.id && localStorage.setItem('appId', response.data.id);
            response.data.name && localStorage.setItem('appName', response.data.name);
            response.data.header_logo && localStorage.setItem('logo', response.data.header_logo);
            response.data.login_logo && localStorage.setItem('login_logo', response.data.login_logo);
            response.data.watermark_logo && localStorage.setItem('watermark', response.data.watermark_logo);
            response.data.watermark_logo_left && localStorage.setItem('watermark_left', response.data.watermark_logo_left);
            response.data.primary_color && localStorage.setItem('headerClr', response.data.primary_color);
            response.data.sponser_logo && localStorage.setItem('sponsor', response.data.sponser_logo);
            response.data.landing_page_logo_left && localStorage.setItem('landing_page_logo_left', response.data.landing_page_logo_left);
            response.data.landing_page_logo_right && localStorage.setItem('landing_page_logo_right', response.data.landing_page_logo_right);
            response.data.landing_page_link_right && localStorage.setItem('landing_page_link_right', response.data.landing_page_link_right);
            response.data.landing_page_link_left && localStorage.setItem('landing_page_link_left', response.data.landing_page_link_left);

            response.data.bracket_logo && localStorage.setItem('bracket', response.data.bracket_logo);
            response.data.secondary_color && localStorage.setItem('secondary', response.data.secondary_color);
            setShowForget(true);
        } else {

            setIsLoader(false);
            return false;
        }
    }, []);

    useEffect(() => {
        if (!isInitialized) {
            getSiteId();
        }
    }, [getSiteId, isInitialized, setIsInitialized, setIsLoader]);

    return isLoader ? (
        <LoaderLayout/>
    ) : <AuthLayout showLogo={showLogo} Logo={loginLogo} forgotRoute={forgotRoute}
                    showForget={showForget}/>;
};

export default Login;
