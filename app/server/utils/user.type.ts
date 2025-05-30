
interface TUser {
    id : number;
    username : string;
    password : string;
    rights : 'user' | 'admin';
    created_at : Date;
}

export default TUser;