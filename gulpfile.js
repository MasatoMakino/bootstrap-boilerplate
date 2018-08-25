/**
 * Created by makinomasato on 2015/12/23.
 */

//Plugins
const gulp = require("gulp");
const connect = require("gulp-connect-php");
const browserSync = require("browser-sync");
const compress = require("compression");

//variable
const distName = "dist";
const distDir = "./" + distName + "/";

/*
 * Server Task
 */
gulp.task("server", function() {
    const port = 9003;

    connect.server(
        {
            port: port,
            base: distDir,
        },
        function() {
            browserSync({
                proxy: "localhost:" + port,
                middleware: [compress()],
                // httpModule: 'http2',
                // https: true
                //httpsが必要な場合は自己証明書を生成して指定する。
            });
        }
    );

    gulp.watch(distDir + "**/*").on("change", function() {
        browserSync.reload();
    });
});
