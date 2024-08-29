import {React,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './Login.css';


function Login2({userId, setUserId}) {
    const nav=useNavigate();
    //const {userId,setUserId} = useContext(IdContext);
    useEffect(() => {
        console.log("pray for me")
        const userId1 = new URLSearchParams(window.location.search).get('userId');
        console.log("User ID: "+userId1)
        if (userId1) {
            console.log("thing: +" + userId1)
            setUserId(userId1);
            console.log("Using context: "+userId)
        }
    }, [setUserId,userId]);

    useEffect(() => {
        if (userId !== null && userId !== -1) {
            console.log("Using updated context: " + userId);
            nav('/search');
        }
    }, [userId, nav]);

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <button className="login-button" onClick={async()=>{
                    window.location.href = 'http://localhost:4000/auth/github';
                }}>q</button>
            </div>
        </div>
    );
}

/*<div>
            <a href="http://localhost:4000/auth/github">Login with GitHub</a>
          </div> */

export default Login2;