import { getSvgImageUrl } from './utilis/api';

console.clear();
const start = Date.now();

// show UI
figma.showUI(__html__, {
  width: 500,
  height: 500
});

const selection = figma.currentPage.selection['0'];

console.log(selection);

if (selection.type === 'FRAME') {
  figma.ui.postMessage({
    type: 'svg',
    name: `${selection.name}_svg`,
    data: selection.id.replace(':', '%3A')
  });
}

if (selection.fills && selection.fills[0]?.type === 'IMAGE') {
  const { imageHash } = selection.fills[0];
  
  var imageLink;
  figma
    .getImageByHash(imageHash)
    .getBytesAsync()
    .then(res => {


      const buffer = Buffer.from(res);

      const base64String = buffer.toString('base64');

      var imageName = 'test';
      figma.ui.postMessage({
        type: 'image',
        name: `${selection.name || 'test'}.png`,
        data: base64String
      });
      imageLink = `background-image: url('./images/"${imageName}.png')}`;
    });

  console.log(imageLink);
}

figma.ui.onmessage = event => {
  if (event.type === 'close') {
    figma.closePlugin();
  }
  if (event.type === 'add-selection') {
    let selected = figma.currentPage.selection['0'];
    if (selected.type === 'FRAME') {
      console.log(selected);

      figma.ui.postMessage({
        type: 'svg',
        name: 'svg',
        data: selected.id.replace(':', '%3A')
      });
    }
    const { imageHash } = selected.fills[0];
    var imageLink;
    figma
      .getImageByHash(imageHash)
      .getBytesAsync()
      .then(res => {
        const buffer = Buffer.from(res);

        const base64String = buffer.toString('base64');

        var imageName = 'test';
        figma.ui.postMessage({
          type: 'image',
          name: `${selected.name || 'test'}.png`,
          data: base64String
        });
        imageLink = `background-image: url('./images/"${imageName}.png')}`;
      });
  }
};

//time taken
const end = Date.now();
const time = ((end - start) / 1000).toFixed(2);
figma.ui.postMessage({
  type: 'time',
  data: `Completed in : ${time}s`
});
console.log('Completed in:', time + 's');
