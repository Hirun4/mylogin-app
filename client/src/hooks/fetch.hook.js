import axios from 'axios';
import { useEffect, useState } from 'react';


axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


export default function useFetch(query){
    const[getData,setData] = useState({isLoading : false,apiData : undefined,status: null,severError: null})

    useEffect(() => {
        if(!query) return;

        const fetchData = async () => {
            try {
                setData(prev =>({...prev, isLoading: true}) )

                const{data,status} = await axios.get(`/api/${query}`);

                if(status === 201){
                    setData(prev =>({...prev, isLoading: false}) )
                    setData(prev =>({...prev, apiData: data , status: status}) )
                }
                setData(prev =>({...prev, isLoading: false}) )
            } catch (error) {
                setData(prev =>({...prev, isLoading: false, severError: error}) )
            }
        };
        fetchData();
    },[query]);

    return [getData,setData];
}