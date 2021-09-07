import React from 'react';
import {Link} from 'react-router-dom';
import ArrowRight from '../../../images/arrow-right.svg';

const List = props => {
    const {apps} = props;

    return (
        <React.Fragment>

            <tbody>
            {apps.length > 0 ? (
                apps.map((app, index) => (
                    <tr className={(index % 2 !== 0 ? 'collapsed' : 'grey-col collapsed')} key={index}>
                        <td><Link to={'/system-dashboard/app/' + app.id}
                                  style={{display: 'block', textDecoration: 'none', color: 'black'}}>{app.name}</Link>
                        </td>
                        <td className="arow-dwn text-right">
                            <Link to={'/system-dashboard/app/' + app.id} style={{display: 'block'}}>
                                <img height="10px" alt="ArrowRight" src={ArrowRight}/>
                            </Link>
                        </td>
                    </tr>
                ))
            ) : ''}
            </tbody>

            {apps && apps.length === 0 ? <div className="d-flex justify-content-center">
                <div className=" text-primary text-center" style={{marginLeft: '50px', marginTop: '20px'}}> No data
                    available
                </div>
            </div> : ''}
        </React.Fragment>
    );
};

export default List;
