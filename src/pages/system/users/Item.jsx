import React, {Fragment} from 'react';
import arrowDown from '../../../images/arrow-dow.svg';
import SingleRow from './SingleRow';
import Mobile from './Mobile';

const Item = props => {
    const {
        user,
        handleModel,
        index,
        isMobile,
        isOpen,
        apps,
        organizations,
        setActiveRadio,
        mobileUser,
        getUser,
        setIsInitialized
    } = props;

    const orgArr = user.organizations && user.organizations.length ? user.organizations.map(org => {
        return org.name;
    }) : [];

    return (
        <Fragment>
            {isMobile && isOpen ? (
                <Mobile user={mobileUser} handleModel={handleModel}/>
            ) : (
                <React.Fragment>
                    <tr
                        className={'arow-dwn ' + (!(index % 2) ? 'grey-col ' : '') + 'collapsed'}
                        data-toggle="collapse"
                        data-target={'.demo' + index}
                    >
                        <td onClick={isMobile ? e => handleModel(e, index) : ''}>
                            {user.firstName
                                ? user.firstName + (user.lastName ? ' ' + user.lastName : '')
                                : user.displayName}
                        </td>
                        <td className="mdnone">{user.username}</td>
                        <td className="mdnone">
                            <p className="word-wraping1">
                                {orgArr && orgArr.length ? orgArr.join(', ') : ''}{' '}
                            </p>
                        </td>
                        <td onClick={isMobile ? e => handleModel(e, index) : ''}> {user.roleName === 0 ? 'none' : user.roleName} </td>
                        <td className="arow-dwn">
                            {isMobile ? (
                                <img
                                    height="10px"
                                    src={arrowDown}
                                    alt="arrowdown"
                                    onClick={e => handleModel(e, index)}
                                />
                            ) : (
                                <img height="10px" src={arrowDown} alt="arrowdown"/>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="5" className="hiddenRow" style={{padding: 0}}>
                            <div className={'collapse demo' + index}>
                                <SingleRow
                                    user={user}
                                    getUser={getUser}
                                    apps={apps}
                                    organizations={organizations}
                                    setActiveRadio={setActiveRadio}
                                    setInitialized={setIsInitialized}
                                />
                            </div>
                        </td>
                    </tr>
                </React.Fragment>
            )}
        </Fragment>
    );
};

export default Item;
