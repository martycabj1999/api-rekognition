module.exports = (req: any, res: any, next: any) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).send("Access denied")
    }
    next();
}
