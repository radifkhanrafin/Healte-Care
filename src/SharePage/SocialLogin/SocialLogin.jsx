import React, { useContext } from 'react';
import { AuthContext } from '../../AuthProvaiders/AuthProvaider';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

const SocialLogin = () => {
    const { googleLogin } = useContext(AuthContext)
    const location = useLocation()
    const navigate = useNavigate()
    const from = location.state?.from?.pathname || "/";

    const handleGoogleLogin = () => {

        googleLogin()
            .then(result => {
                const loggedUser = result.user;
                const userinfo = { name: loggedUser.displayName, email: loggedUser.email, userProfile: loggedUser.photoURL, role: "users" };
                console.log(userinfo)

                fetch('https://doctors-server-update.vercel.app/users', {
                    method: "POST",
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(userinfo)
                })
                    .then(res => res.json())
                    .then((data) => {
                        navigate(from, { replace: true })
                        if (data.insertedId) {
                            console.log('data', data)
                            navigate('/')
                        }
                    })
            })
            .catch(error => {
                console.log(error)
            })
    }
    return (
        <div className='p-3'>
            <button className='hover-btn w-full ' onClick={handleGoogleLogin}>
                <FaGoogle className='text-red-800 text-2xl' />
                continue with google
            </button>
        </div>
    );
};

export default SocialLogin;