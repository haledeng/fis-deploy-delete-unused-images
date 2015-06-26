var path = require('path');

var IMG_PATH = 'img';

var root = fis.project.getProjectPath();

// get all image list from src
function getAllList(){
    var imgPath = path.join(root, IMG_PATH);
    var _allImageList = fis.util.find(imgPath, /.*\.(png|jpg|gif)/),
        ret = [];
    _allImageList.forEach(function(img){
        ret.push(path.relative(imgPath, img).replace(/\\/g,'/'));
    });
    return ret;
}

var allImageList = getAllList(),
    usedImageList = [];

// get used image list
function getUsedList(file){
    var content,
        reg,
        extname;
    // css inline in html, and xxx.async.scss will be parsed as xxx.async.scss_min_yyy.js
    // async css will be imported as js
    if(file.isHtmlLike || file.isJsLike){
        content = file.getContent();
        allImageList.forEach(function(img){
            extname = path.extname(img);
            // md5
            reg = new RegExp(img.replace(extname, '') + '_[a-zA-z0-9]{7}' + extname);
            if(reg.test(content) && usedImageList.indexOf(img) === -1){
                usedImageList.push(img);
            }
        });
    }
}

// array diff
function arrayDiff(all, part){
    var ret = [];
    all.forEach(function(img){
        if(part.indexOf(img) === -1){
            ret.push(img);
        }
    });
    return ret;
}


module.exports = function(files, settings, callback) {
    var file;

    files.forEach(function(fileInfo){
        file = fileInfo.file;
        getUsedList(file);
    });

    var unUsedImageList = arrayDiff(allImageList, usedImageList);
    var dest,
        name;

    files.forEach(function(fileInfo){
        file = fileInfo.file;
        // md5
        name = ((fileInfo.dest.to || '/') + fileInfo.dest.release).replace(/^\/*/g, '');
        dest = path.join(root, name);
        if(file.isImage()){
            // image name is not in unUsedImageList
            if(unUsedImageList.indexOf(file.release.replace('/img/', '')) == -1){
                fis.util.write(dest, fileInfo.content); 
            }
        }else{
            fis.util.write(dest, fileInfo.content); 
        }
       
    });
}

module.exports.fullpack = true;