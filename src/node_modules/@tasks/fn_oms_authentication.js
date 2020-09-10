module.exports = function Authentication() {
    return 'Basic ' + Buffer.from(process.env.OMS_USER + ":" + process.env.OMS_PASSWORD).toString('base64');
}