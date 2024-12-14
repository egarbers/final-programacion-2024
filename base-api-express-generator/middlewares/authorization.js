function authorization(req, res, next) {
    req.isAdmin = function isAdmin() {
        return req.user && req.user.role === 'admin'
    }

    req.isEmployee = function isEmployee() {
        return req.user && req.user.role === 'employee'
    }

    return next(null)
}

export default authorization
