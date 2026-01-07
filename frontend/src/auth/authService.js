import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

export function saveToken(token){
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(){
    return localStorage.getItem(TOKEN_KEY)
}
export function isTokenExpired(token){
    if(!token)return true;
    try{
        const {exp} = jwtDecode(token);
        return Date.now() >= exp * 1000;
    }catch{
        return true;
    }
}
export function logout(){
    localStorage.removeItem(TOKEN_KEY);
}

export function getCurrentUser(){
    const token = getToken();
    if(!token||isTokenExpired(token)) {
        logout();
        return null;
       }
       return jwtDecode(token);
    } 
export function isAuthenticated(){
        return !!getToken()&& !isTokenExpired(getToken());
}
export function hasRole(role){
    const user = getCurrentUser();
    return user?.role === role;
}