/**
 * Created by cform on 17/1/12.
 */
/*
const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const config = require('../config');

module.exports = {
    /!**
     *
     * @param file 图片上传的file属性， 由rel.file提供
     *
     *!/
    imageRenameMin : (file)=>{
      const origraneImgfile = file.destination + file.filename;
      const lastImgfile = origraneImgfile + '.' + file.mimetype.replace('image/', '');
      fs.rename(origraneImgfile, lastImgfile, ()=>{
          const imgBuildPath = path.join(config.rootPath, 'public/', 'images');
          gulp.src(lastImgfile)
              .pipe(imagemin())
              .pipe(gulp.dest(imgBuildPath));
      });
  }  
};*/
