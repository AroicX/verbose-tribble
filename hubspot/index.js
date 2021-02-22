var request = require('request');
var fs = require('fs');

const KEY = `enter_key`;

var postUrl = `https://api.hubapi.com/filemanager/api/v3/files/upload?hapikey=${KEY}`;

var filename = 'image.png';

var fileOptions = {
  access: 'PUBLIC_INDEXABLE',
  ttl: 'P3M',
  overwrite: false,
  duplicateValidationStrategy: 'NONE',
  duplicateValidationScope: 'ENTIRE_PORTAL'
};

var formData = {
  file: fs.createReadStream(filename),
  options: JSON.stringify(fileOptions),
  folderPath: 'docs'
};

request.post(
  {
    url: postUrl,
    formData: formData
  },
  function optionalCallback(err, httpResponse, body) {
    return console.log(err, httpResponse.statusCode, body);
  }
);
