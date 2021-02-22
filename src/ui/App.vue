<template>
  <div class="brix">
    <section class="header">
      <span class="type ">Brix Hubspot </span>
      <button class='button button--primary' @click="addSelection">Add Selection</button>
    </section>

    <div class="message" v-if="notify">
      <span>Successfully uploaded</span>
    </div>


    <div class="image-grid" id="image-holder">


    </div>

    <section class="footer">
      <span class="type type--small">{{this.imageArr.length}} images selected </span>
      <button class='button button--primary' @click="uploadImage">Export all</button>
    </section>
  </div>
</template>

<script>
  import "../figma/figma-ds/js/selectMenu";
  import "../figma/figma-ds/js/iconInput";
  import "../figma/figma-ds/js/disclosure";
  import {
    apiRequest,
    b64toBlob,
    hubSpot,
    formatBytes
  } from "./utilis/transformers";





  export default {
    data() {
      return {
        imageArr: [],
        blob: [],
        notify: false
      };
    },

    components: {
      // Welcome
    },

    mounted() {
      // Initialize the figma-ds components
      window.selectMenu.init();
      window.iconInput.init();
      window.disclosure.init();




      window.onmessage = event => {
        const {
          type,
          name,
          data
        } = event.data.pluginMessage;



        if (event.data.pluginMessage.type === 'image') {

          this.imageArr.push({
            name: event.data.pluginMessage.name.replace(/\s+/g, ''),
            image: event.data.pluginMessage.data
          });

          let parent = document.getElementById('image-holder');
          let b64Data = `${event.data.pluginMessage.data}`

          var contentType = 'image/png';
          var blob = b64toBlob(b64Data, contentType);
          console.log(blob);
          var blobUrl = URL.createObjectURL(blob);
          // create temporary url 
          var div = document.createElement('div');
          var imageName = document.createElement('span');
          var input = document.createElement('input');
          var img = document.createElement('img');
          img.src = blobUrl;
          img.height = 200;
          imageName.className = 'font-sm';
          imageName.innerHTML =
            `${event.data.pluginMessage.name.replace(/\s+/g, '')} <br/> <b class="bold">Size:</b> ${formatBytes(blob.size)}`;
          input.className = 'checkbox'
          input.type = 'checkbox'
          input.id = event.data.pluginMessage.name.replace(/\s+/g, '')
          input.value = event.data.pluginMessage.name.replace(/\s+/g, '')
          input.onchange = this.changeInput();
          div.appendChild(img);
          div.appendChild(input);
          div.appendChild(imageName);



          // 
          parent.appendChild(div);
          this.blob = [];
          this.blob.push({
            name: event.data.pluginMessage.name,
            image: blob
          });
          console.log('The Blob', this.blob);






        }
        if (event.data.pluginMessage.type === 'svg') {
          // console.log(event.data.pluginMessage);


          apiRequest(
            `https://api.figma.com/v1/images/EEH18lQVLGJJPVA5AIsU95/?ids=${event.data.pluginMessage.data}&format=svg`
          ).then((response) => {
            const {
              images
            } = response;
            // console.log();
            // returns an object with node id as key
            // and value of an s3 link to the svg file
            const svgUrl = Object.values(images)[0];
            fetch(svgUrl)
              .then(res => {
                console.log(res);
                return res.text();
              })
              .then(svg => {
                let parent = document.getElementById('imageholder');
                var div = document.createElement('div');

                div.innerHTML = svg;
                parent.append(div);
                console.log(svg);
              });
          });


        }

      };
    },
    methods: {
      addSelection() {
              this.notify = false


        parent.postMessage({
            pluginMessage: {
              type: 'add-selection'
            }
          },
          '*'
        );
      },
      uploadImage() {


        let blobData = this.blob[0]['image'];

        hubSpot(blobData)
          .then((res) => {
            // let js = JSON.parse(res.data);
            if(res.data){
              this.notify = true
            }

          }).catch(err => console.log(err))

      },
      changeInput(e){
        console.log(e);
      }
    }


  };
</script>

<style lang="scss">
  @import "../figma/figma-ds/figma-plugin-ds";
</style>