import React, { Fragment, useState } from 'react';
import './style.css';
import AutheService from '../../services/AuthenticationService';
import { Redirect } from 'react-router';
import Loading from '../../assets/loading.svg';
import InputField from '../InputField';
import { useForm } from 'react-hook-form';

function FormLogin(props) {
    const [loading, setLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const { register, errors, setError, handleSubmit } = useForm();
    const login = async (data) => {
        const credentails = JSON.stringify(data);
        try {
            setLoading(true);
            const response = await AutheService.login(credentails);
            if (response.status === 200) {
                const res = await AutheService.getUser(data.username);
                if (res.status === 200) {
                    const { userId, userName, avatar, roleId } = res.data;
                    localStorage.setItem("account", JSON.stringify({ userId, userName, avatar, roleId }))
                    setRedirect(true);
                }
            }
        } catch (err) {
            if(err.response){
                setError("connection", "Cannot connect to server!")
            } else if (err.response && err.response.status === 401) {
                setError("authentication", "Username or password is incorrect!");
            }
        } finally {
            setLoading(false);
        }
    }

    // useEffect(() => {
    //     localStorage.setItem("user-info", JSON.stringify(userInfo));
    // }, [userInfo])

    return <Fragment>
        {redirect ? <Redirect to="/chat/a" /> :
            <form className="form">
                <h1 className="title">Login</h1>
                <InputField
                    register={register}
                    name="username"
                    type="text"
                    label="Username"
                    errors={errors}
                    icon={<i className="fa fa-user" aria-hidden="true"></i>}
                />
                <InputField
                    register={register}
                    type="password"
                    name="password"
                    label="Password"
                    errors={errors}
                    icon={<i className="fa fa-key" aria-hidden="true"></i>}
                />
                <div style={{ 'marginTop': '40px' }} />
                <button type="submit" className="button-login" onClick={handleSubmit(login)}>
                    {loading ? <img src={Loading} alt="Loading" width="30px" height="30px" /> : "LOGIN"}
                </button>
                {errors.authentication ? <p className="error-message">{errors.authentication.message}</p> : null}
                {errors.connection ? <p className="error-message">{errors.connection.message}</p> : null}
                <div style={{ 'marginTop': '25px' }} />
                <p className="link-create">Don't have account? <a href="google.com">Register Here</a></p>
            </form>}
    </Fragment>
}

export default FormLogin;