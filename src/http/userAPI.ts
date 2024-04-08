import { AxiosResponse } from "axios"; 
import {$authHost, $host} from "./index";
import { jwtDecode } from "jwt-decode";
export const STUDENT_ROLE: string = "STUDENT"; 
export const TEACHER_ROLE: string = "TEACHER";

export const registration = async (email: string, full_name: string, password: string, role: string): Promise<AxiosResponse<any>> => {
    const response: AxiosResponse<any> = await $host.post('api/user/registration', { email, full_name, password, role });
    localStorage.setItem('token',response.data.token)
    return   jwtDecode(response.data.token);
}

export const login = async (email: string, password: string): Promise<AxiosResponse<any>> => {
    const response: AxiosResponse<any> = await $host.post('api/user/login', { email, password });
    localStorage.setItem('token',response.data.token)
    return   jwtDecode(response.data.token);
}

export const check = async (): Promise<AxiosResponse<any>> => {
    const response: AxiosResponse<any> = await $authHost.get('api/user/auth');
    localStorage.setItem('token',response.data.token)
    return   jwtDecode(response.data.token);
}

