var gulp = require('gulp'),
    rev = require('gulp-rev'), //- 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector'), //- 路径替换
    uglify=require('gulp-uglify'),//js压缩
    minifyCss = require("gulp-minify-css"),//压缩CSS
    minifyHtml = require("gulp-minify-html"),//压缩html
    clean = require('gulp-clean'),//- 清空文件夹，避免资源冗余
    tinypng_nokey = require('gulp-tinypng-nokey'),    //压缩图片3 免费
    webserver = require('gulp-webserver')//搭建服务器跨域代理
gulp.task('webserver', function () {
    gulp.src('./')
        .pipe(webserver({
            host: 'localhost',
            port: 5000,
            livereload: true,
            open: './page/login.html',
            directoryListing: {
                enable: true,
                path: './'
            },
            proxies: [
                {
                    source: '/SHSS1', target: 'http://itzx.price51.com/SHSS1'
                }
            ]
        }))
});
var web = {
    //源码地址
    srcPath:{
        html:'*.html',
        html2:'page/*.html',
        js:['js/**/*.js','!js/lib/**/*.js'],
        lib:'js/lib/**/*',
        css:'css/**/*.css',
        images1:'images1/*',
        img:'img/*',
        json:'json/*.js',
        font:'font/*',
        tool:'tool/*.js',
        iconfont:'iconfont/*'
    },
    //开发地址
    developPath:'build/',
    //发布地址
    releasePath:'SHSSVIEW/'
}
//清空文件夹，避免资源冗余css
gulp.task('cleancss',function(){
    return gulp.src(web.releasePath,{read:false}).pipe(clean());
});
//引用的第三方js
gulp.task('iconfont',function () {
    return gulp.src(web.srcPath.iconfont)
          .pipe(gulp.dest(web.releasePath+'iconfont/'));
})
gulp.task('lib',function () {
    return gulp.src(web.srcPath.lib)
        .pipe(gulp.dest(web.releasePath+'js/lib'));
})
//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function() {
    return  gulp.src(web.srcPath.css)
        .pipe(rev())
        .pipe(minifyCss())
        .pipe(gulp.dest(web.releasePath+'css/'))//- 输出文件本地
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});
//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function() {
    return gulp.src(web.srcPath.js)
        .pipe(rev())
        .pipe(uglify())
        .pipe(gulp.dest(web.releasePath+'js/'))//- 输出文件本地
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});
//图片的处理
gulp.task('images1', function() {
    return gulp.src(web.srcPath.images1)
        .pipe(tinypng_nokey ())
        .pipe(gulp.dest(web.releasePath+'images1/'));
});
gulp.task('img', function() {
    return gulp.src(web.srcPath.img)
        .pipe(tinypng_nokey ())
        .pipe(gulp.dest(web.releasePath+'img/'));
});
gulp.task('json', function() {
    return gulp.src(web.srcPath.json)
        .pipe(gulp.dest(web.releasePath+'json/'));
});
gulp.task('font', function() {
    return gulp.src('font/*')
        .pipe(gulp.dest(web.releasePath+'font/'));
});
gulp.task('layui',function(){
    return gulp.src('layui/**/*')
        .pipe(gulp.dest(web.releasePath+'layui/'));
})
//对favicon.ico的处理
gulp.task('favicon',function () {
    return gulp.src('favicon.ico')
        .pipe(gulp.dest(web.releasePath))
})
gulp.task('tool',function(){
    return gulp.src('tool/*.js')
        .pipe(rev())
        .pipe(uglify())
        .pipe(gulp.dest(web.releasePath+'/tool'))//- 输出文件本地
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/tool'))
})
gulp.task('xls',function () {
    return gulp.src('xls/*.xls')
        .pipe(gulp.dest(web.releasePath+'/xls'))//- 输出文件本地
})
//Html更换css、js文件版本
gulp.task('revHtml', function() {
    return gulp.src(['rev/**/*.json', web.srcPath.html]) /*WEB-INF/views是本地html文件的路径，可自行配置*/
        .pipe(revCollector())
        .pipe(gulp.dest(web.releasePath)); /*Html更换css、js文件版本,WEB-INF/views也是和本地html文件的路径一致*/
});
//Html更换css、js文件版本
gulp.task('revHtml2', function() {
    return gulp.src(['rev/**/*.json', web.srcPath.html2]) /*WEB-INF/views是本地html文件的路径，可自行配置*/
        .pipe(revCollector())
        .pipe(gulp.dest(web.releasePath+'page/')); /*Html更换css、js文件版本,WEB-INF/views也是和本地html文件的路径一致*/
});
//给js添加版本号
//给图片天剑版本号
gulp.task('default', gulp.series('cleancss','revCss','revJs','images1','lib','iconfont','img','xls','json','font','layui','tool','favicon','revHtml','revHtml2'))
