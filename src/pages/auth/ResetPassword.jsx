import React from 'react';
import {useHistory} from 'react-router-dom';


const ResetPassword = () => {
    const logo = localStorage.getItem('logo');
    const history = useHistory();
    const message = history.location.state.message;
    const handleSubmit = (e) => {
        e.preventDefault();
        history.push('/login');
    };

    return <div className="main-d dashboard loginn forgt-pass">
        <div className="container">
            <div className="row">
                <div className="col-md-5 mx-auto">
                    <div id="first">

                        <div className="myform form">
                            <div className="logo mb-3">
                                
                                <img className="mx-auto d-block mb-4" style={{height:'8.5vh',marginLeft:'10px'}} src={logo} alt={logo}/>
                                
                                <div className="col-md-12 p-0 text-center">
                                    <h1>Reset Password</h1>
                                </div>
                            </div>
                            <form onSubmit={e => handleSubmit(e)}>
                                <p className="text-center">{message}</p>

                                <div className="col-md-12 p-0 mt-5 text-center ">
                                    <button type="button"
                                            className=" btn btn-block mybtn btn-primary main-btn-cncel">Contact Support
                                    </button>
                                    <button
                                        type="submit"
                                        className='btn btn-block mybtn btn-primary'
                                    > OK
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
};

export default ResetPassword;
