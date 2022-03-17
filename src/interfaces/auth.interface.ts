interface User {
    id_user: number,
    name_user: string,
    last_name_user: string,
    nick_name_user: string,
}
interface Login {
    nick_name_user: string,
    password: string,
}

export {
    User,
    Login
}