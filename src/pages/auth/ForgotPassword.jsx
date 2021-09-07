import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import ToasterLayout from "../../layouts/ToasterLayout";
import LoaderLayout from "../../layouts/LoaderLayout";
import {helpers} from "../../helper";
import {Link} from 'react-router-dom'

const ForgotPassword = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [isLoader, setIsLoader] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState('');
    const [nameError, setNameError] = useState('');

    const logo = localStorage.getItem('logo');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoader(true);
        const msg = 'userName or email can not be empty';
        if (!email) {

            setNameError(msg);
            setIsLoader(false);
            return false;
        } else {
            setNameError(null);
        }

        const data = await helpers.forgotPassword('POST', {email});
        if (data.status === 200) {
            history.push({
                pathname: '/reset-password',
                state: {message: JSON.parse(data.data)['confirmationMessage']}
            })
        } else {
            setError(data.message);
            setIsLoader(false);
            setIsError(true);
            return false;
        }

    };
    const handleForget = async e => {
        const value = e.target.value;

        if (!value) {
            setNameError('This value can not be blank');
            return false
        } else {
            setNameError(null);
            setEmail(value);
        }
    };


    return isLoader ? (
        <LoaderLayout/>
    ) : (
        <div className="main-d dashboard loginn forgt-pass">
            {isError && <ToasterLayout mesasge={error} open={true}/>}
            <div className="container">
                <div className="row">
                    <div className="col-md-5 mx-auto">
                        <div id="first">

                            <div className="myform form">
                                <div className="logo m-3">
                                    {logo ? <img className="mx-auto d-block mb-4" src={logo} alt={logo}
                                                 style={{height: '50px'}}/> : ''}
                                    <div className="col-md-12 p-0 text-center">
                                        <h1>Forgot Password</h1>
                                    </div>
                                </div>
                                <form onSubmit={e => handleSubmit(e)}>
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={email}
                                            onChange={handleForget}
                                            className="form-control"
                                            placeholder="Enter Email or Username"
                                        />
                                        <span className="help-block error text-danger">
                                            {nameError ? nameError : ''}
                                        </span>
                                    </div>

                                    <div className="col-md-12 p-0 mt-5 text-center ">
                                        <Link to='/login' className=" btn btn-block mybtn btn-primary main-btn-cncel">
                                            Cancel
                                        </Link>

                                        <button
                                            type="submit"
                                            className={
                                                'btn btn-block mybtn btn-primary '
                                            }

                                        > Reset
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};

export default ForgotPassword;
