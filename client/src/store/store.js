//import create from 'zustand';
import { create } from 'zustand';
import Username from '../components/Username';

export const useAuthStore = create((set) =>({
    auth : {
        Username : '',
        active : false
    },
    setUsername : (name) => set((state) => ({ auth : {...state.auth, username : name }}))
}))

//usetate in normal way