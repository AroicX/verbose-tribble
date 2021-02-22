import axios from 'axios';
var fs = require('fs');

const ACCESS_TOKEN = '140347-4084f1f3-b692-4478-82f0-6142a7278af4';
const HUBSPOT_KEY = `eedfb92f-8492-4ab0-a31e-e7d89156871b`;

// const FILE_ID = 'fileId';
// const NODE_ID = 'Check the url for something like => 3%3A2';
// const container = document.getElementById('figma-container');

// let image = document.createElement('img');
// image.src =
//   `data:image/gif;base64,${event.data.pluginMessage.data}`
// // image.width = 300;
// image.height = 300;
// image.alt = event.data.pluginMessage.name;
// parent.appendChild(image);

export function apiRequest(url) {
  return fetch(url, {
    method: 'GET',
    headers: {
      'x-figma-token': ACCESS_TOKEN
    }
  })
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      return {
        err: error
      };
    });
}

// export const b64toBlob = (base64, type = 'application/octet-stream') =>
//   fetch(`data:${type};base64,${base64}`)
//     .then(res => res.blob())
//     .then(console.log);

export function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {
    type: contentType
  });
  return blob;
}

export function hubSpot(blob) {
  // let postUrl = `https://api.hubapi.com/filemanager/api/v3/files/upload?hapikey=${HUBSPOT_KEY}`;

  let fileOptions = {
    access: 'PUBLIC_INDEXABLE',
    ttl: 'P3M',
    overwrite: false,
    duplicateValidationStrategy: 'NONE',
    duplicateValidationScope: 'ENTIRE_PORTAL'
  };

  var file = new File([blob], 'image.png');
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`https://basecash.test/api/upload`, formData, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR2FicmllbCBPa3Vub2xhIiwiZW1haWwiOiJBcm93b3NlZ2JlNjdAZ21haWwuY29tIiwiaWQiOjEsImlhdCI6MTYxMjYxNTc1NiwiZXhwIjoxNjQ0MTUxNzU2fQ.PZyV6oH6HZlREok_uBB9Zhzx5V-xHU06bgGK9A_ND4g`
    }
  });
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
