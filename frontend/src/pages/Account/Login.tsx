import { useState } from "react";
import { API_URL } from "../../constants";
import { getCookie, getUserInfo } from "../../utils";


export default function Login(){
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    
    const handleChange = (key: 'username' | 'password', event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        formData[key] = event.target.value;
        setFormData(formData);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch(API_URL+'auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password,
              })

           }).then(response => console.log(response))
           .then(() => getUserInfo())
           .catch(err => console.error(err));

        
    };


    return(
        <main>
            <form action="http://127.0.0.1:8000/api/v1/api-auth/login/" method="post" onSubmit={handleSubmit} >

                <input onChange={(e) => handleChange('username', e)} type="text" name="username" id="username" />
                <input onChange={(e) => handleChange('password', e)} type="password" name="password" id="password" />
                <button type="submit">Submit</button>
            </form>
        </main>
    );
}