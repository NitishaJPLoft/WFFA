import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import {useMediaQuery} from 'react-responsive';
import LoaderLayout from '../../layouts/LoaderLayout';
import Toasterlayout from '../../layouts/ToasterLayout';
import {helpers} from '../../helper';
import PageTitle from '../../components/PageTitle';
import psl from 'psl';

const parsed = psl.parse(window.location.hostname);
const subdomain = parsed.subdomain;
const title = subdomain
    ? subdomain.toUpperCase() + ' Dashboard'
    : 'WFFA Dashboard';

const AuthLayout = props => {
    const {Logo, showForget, forgotRoute, showLogo} = props;
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoader, setIsLoader] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const isMobile = useMediaQuery({query: '(max-width: 999px)'});

    const handleUserName = e => {
        const value = e.target.value;
        setEmail(value);
        if (!value) {
            setUsernameError('Please provide a valid Email/Username.');
        } else {
            setUsernameError(false);
        }
    };

    const handlePassword = e => {
        const value = e.target.value;
        const msg = 'password can not be empty';
        if (value === null) {
            setPasswordError(msg);
        } else {
            setPassword(value);
            setPasswordError(false);
        }

    };
    const login = async e => {
        const appId = localStorage.getItem('appId');
        e.preventDefault();
        const msg = 'Enter your Username or Email address';
        const msg1 = 'Enter your password';

        if (!email) {

            setUsernameError(msg);
            setIsLoader(false);

        } else {
            setUsernameError(null);
        }
        if (!password) {

            setPasswordError(msg1);
            setIsLoader(false);
            return false;
        } else {
            setPasswordError(null);
        }

        setIsLoader(!isLoader);
        if (email && password) {
            const data = await helpers.login('POST', {email, password, appId});
            if (data.status === 200) {
                localStorage.setItem('user', JSON.stringify(data.data.user));
                localStorage.setItem('token', data.data.token);
                const roleId = data.data.user.approleuser ? data.data.user.approleuser.role_id : data.data.user.role[0].id;
                localStorage.setItem('roleId', roleId);
                const path =
                    roleId === 4
                        ? '/judge-dashboard'
                        : roleId === 2
                        ? '/application-dashboard'
                        : roleId === 3
                            ? '/organisation-dashboard'
                            : '/system-dashboard';
                history.push(path);
            } else {
                setError(data.message);
                setIsLoader(false);
                setIsError(true);
                return false;
            }
        }
    };

    return isLoader ? (
        <LoaderLayout/>
    ) : (

        <div className="main-d dashboard loginn">
            <PageTitle title={title}/>
            {isError && <Toasterlayout mesasge={error} open={true}/>}
            <div className="container">
                <div className="row">
                    <div className="col-md-5 mx-auto">
                        <div id="first">
                            <div className="myform form">
                                <div className="logo mb-3">
                                    {showLogo && Logo ? (
                                        <img
                                            className="mx-auto d-block mb-4"
                                            alt="logo"
                                            style={{height: '50px'}}
                                            src={Logo}
                                        />
                                    ) : (
                                        isMobile ? <div style={{height: '50px', marginBottom: '1.5rem'}}/> : ''
                                    )}

                                    <div className="col-md-12 p-0 text-center">
                                        <h1>Login</h1>
                                    </div>
                                </div>
                                <form onSubmit={e => login(e)}>
                                    <div className="form-group has-warning">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={email}
                                            onChange={handleUserName}
                                            className="form-control"
                                            placeholder="Enter Email or Username"
                                        />
                                        <span className="help-block error text-danger">
                      {usernameError ? usernameError : ''}
                    </span>
                                    </div>
                                    <div className="form-group has-warning">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={handlePassword}
                                            className="form-control"
                                            placeholder="Enter Password"
                                        />
                                        <span className="help-block error text-danger">
                      {passwordError ? passwordError : ''}
                    </span>
                                    </div>

                                    <div className="col-md-12 p-0 mt-5 text-center ">
                                        <button
                                            type="submit"
                                            className={
                                                'btn btn-block mybtn btn-primary '

                                            }

                                        >
                                            Login
                                        </button>
                                    </div>

                                    {showForget && forgotRoute ? (
                                        <div className="form-group">
                                            <p className="text-center">
                                                <Link to={forgotRoute}> Forgot Password </Link>
                                            </p>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
