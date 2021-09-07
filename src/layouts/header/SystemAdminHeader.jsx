import React, {Fragment} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';

const SystemAdminHeader = props => {
    const history = useHistory();
    const location = useLocation();
    const currentPath = location.pathname;
    let activeI = currentPath.includes('system') ?
        currentPath === '/system-dashboard' ? 0 : currentPath.includes('app') ? 1 : currentPath.includes('users') ? 2: ''
    : currentPath.includes('judging') ? 2 : currentPath.includes('tournaments') ? 1 : currentPath.includes('users') ? 0 : '';

    const [activeIndex, setActiveIndex] = React.useState(activeI);

    const handleOnClick = (e, index, link) => {
        e.preventDefault();
        history.push(link);
        setActiveIndex(index); // remove the curly braces
    };

    return (
        <ul className="navbar-nav mr-auto">
            {props.showMenu &&
            <Fragment>
                {
                    props.menus && props.menus.length ? props.menus.map((menu, index) => {
                        return <li className={"nav-item " + (activeIndex === index ? "menu-active" : "")} key={index}>
                            <Link to={menu.link} className="nav-link" onClick={e => handleOnClick(e, index, menu.link)}>
                                {menu.name} <span className="sr-only">(current)</span>
                            </Link>
                        </li>
                    }) : null
                }
            </Fragment>}
        </ul>
    );
};

export default SystemAdminHeader;