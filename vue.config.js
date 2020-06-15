const path = require("path");

module.exports = {
    outputDir: path.resolve(__dirname, "./server/public"),
    devServer: {
        proxy: {
            "/api":{
                target: "https://localhost:" + process.env.PORT,
            }
        },
        https: true
    }
}