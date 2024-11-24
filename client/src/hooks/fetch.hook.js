import axios from 'axios';
import { useEffect, useState } from 'react';


axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


export default function useFetch(query){
    const[getData,setData] = useState({isLoading : false,apiData : undefined,status: null,severError: null})

    useEffect(() => {
        if(!query) return;

        const fetchData = async () => {
            try {
                
            } catch (error) {
                setData(prev =>({...prev, isLoading: false}) )
            }
        }
    })
}