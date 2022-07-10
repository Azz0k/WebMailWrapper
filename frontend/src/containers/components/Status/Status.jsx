import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import apiClient from "../../service";
import {Error, Login} from "../../reducers";

const Status = () => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState({});

    const username = useSelector(state => state.userdata.username)
    useEffect(()=>{
        apiClient.get('/users')
            .then(response => setUsers(response.data))
            .catch(error=> dispatch(Error(error.message)));
        },[]
    );
    const usersLength = () => {
        let result = 0;
        for (const key in users) {
            result+= users[key].length;
        }
        return result;
    }

    return(
        <div>
            <p>Версия 0.1</p>
            <p>Вы вошли как: {username}</p>
            <p>Количество пользователей: {usersLength()}</p>
        </div>
    );
};

export default Status;