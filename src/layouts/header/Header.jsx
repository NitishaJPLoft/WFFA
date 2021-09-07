import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import SystemAdminHeader from './SystemAdminHeader';
import PageTitle from '../../components/PageTitle';
import psl from 'psl';

const Header = props => {
    const {user} = props;
    let history = useHistory();
    const [showMenu, setShowMenu] = useState(true);
    const [menus, setMenus] = useState([]);
    const parsed = psl.parse(window.location.hostname);
    const subdomain = parsed.subdomain;
    const logo = localStorage.getItem('logo');
    const headerClr = localStorage.getItem('headerClr');
    const roleId = localStorage.getItem('roleId');
    const title = subdomain
        ? subdomain.toUpperCase() + 'Dashboard'
        : 'WFFA Dashboard';

    useEffect(() => {
        if (roleId === '4') {
            setShowMenu(false);
        }
    }, [history.location.pathname, roleId]);

    const logout = () => {
        localStorage.clear();
        history.push('/login');
    };

    useEffect(() => {
        if (roleId === '3' || roleId === '2') {
            setMenus([
                {
                    name: 'User',
                    link:
                        roleId === '3'
                            ? '/organisation-dashboard/users'
                            : '/application-dashboard/users',
                },
                {
                    name: 'Tournaments',
                    link:
                        roleId === '3'
                            ? '/organisation-dashboard/tournaments'
                            : '/application-dashboard/tournaments',
                },
                {
                    name: 'Judging',
                    link:
                        roleId === '3'
                            ? '/organisation-dashboard/judging'
                            : '/application-dashboard/judging',
                },
            ]);
        } else {
            setMenus([
                {
                    name: 'Dashboard',
                    link: '/system-dashboard',
                },
                {
                    name: 'Applications',
                    link: '/system-dashboard/app',
                },
                {
                    name: 'Users',
                    link: '/system-dashboard/users',
                },
            ]);
        }
    }, [roleId]);

    return (
        <nav
            className={
                'navbar navbar-expand-lg navbar-light ' + (!headerClr ? 'bg-light' : '')
            }
            style={{background: headerClr}}
        >
            <PageTitle title={title}/>
            
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"/>
            </button>

            {logo && (
                <Link to="/" className="navbar-brand">
                    <img height="30" alt="logo" src={logo}/>
                </Link>
            )}

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <SystemAdminHeader showMenu={showMenu} menus={menus}/>
                <ul className="navbar-nav user-menu">
                    <li className="nav-item dropdown">
                        <Link
                            to={roleId !== '1' ? "/user-profile" : '#'}
                            className="nav-link dropdown-toggle"
                            id="navDropDownLink"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <img alt="user" src={user.avatarURL} width="40" height="40"/>{' '}
                            {user && user.displayName ? user.displayName : user.firstName}
                        </Link>
                    </li>
                    <li>
                        <span className="nav-link ml-3">|</span>
                    </li>
                    <li>
                        <Link
                            to="#"
                            onClick={logout}
                            style={{marginLeft: '20px'}}
                            className="nav-link"
                        >
                            Logout
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
