const prefix = process.env.NODE_ENV === 'development' ? '/api' : '';

export default {
    user_info : prefix + '/user/info',
    logout : prefix + '/logout'
}
