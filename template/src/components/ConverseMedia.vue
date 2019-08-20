<template>
  <div class="cs-line-media">
    <span class="cs-icon-media" :class="getClassIconMedia"></span>
    <span class="cs-text-divider">{{ dateMoment }}</span>
  </div>
</template>

<script>
  export default {
    name: 'ConverseMedia',
    props: {
      dialog:{
        required: true,
        type: Object
      }
    },
    computed: {
      dateMoment(){
        let now = new Date();
        if(this.dialog.hour && this.dialog.hour.getDate() === now.getDate()){
          return 'Hoje';
        }
        else{
          return this.dialog.hour.toLocaleDateString()
        }
      },
      getClassIconMedia(){
        let classe;
        switch(this.dialog.media){
          case 'CONTACT_STUDIO_MESSENGER':
            classe = 'icon-web';
            break;
          case 'FACEBOOK_MESSENGER':
            classe = 'icon-messenger';
            break;
          case 'TELEGRAM':
            classe = 'icon-telegram';
            break;
          case 'WHATSAPP':
            classe = 'icon-whatsapp';
            break;
          case 'MOBILE':
            classe = 'icon-mobile';
            break;
          case 'RCS':
            classe = 'icon-rcs';
            break;
        }
        return classe;
      }
    }
  }
</script>
