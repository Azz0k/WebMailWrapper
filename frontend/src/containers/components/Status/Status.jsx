import React  from "react";
import {useSelector} from "react-redux";


const Status = ({users}) => {
    const username = useSelector(state => state.username)
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