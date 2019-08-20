<template>
  <keep-alive>
    <div class="cs-contact total-height">
      <div class="row total-height">
        <div class="total-height" :class="{'col-md-12': !showMoreInfo, 'col-md-7': showMoreInfo}">
          <div class="cs-contact-header">
            <div class="row">
              <div class="col-md-4">
                <span class="cs-contact-name">{{ contactName }}</span>
              </div>
              <div class="col-md-8 text-right">
                <span @click="moreInfo('Transferir')" class="glyphicon glyphicon-send icon-grid" title="Transferir"></span>
                <div class="cs-separator"></div>
                <span @click="moreInfo('Tabulação')" class="glyphicon glyphicon-list icon-grid" title="Tabulação"></span>
                <span @click="moreInfo('Informações')" class="glyphicon glyphicon-tasks icon-grid" title="Informações do Contato"></span>
              </div>
            </div>
          </div>
          <div class="cs-conversation">
            <div v-for="(conv, idx) in dialogs" :key="idx">
              <CsConverseRight v-if="conv.send === 'agent'" :dialog="conv" />
              <CsConverseLeft v-if="conv.send === 'visitor'" :dialog="conv" />
              <ConverseMedia v-if="conv.send === 'media'" :dialog="conv" />
            </div>
          </div>
          <div class="textMessage">
            <textarea class="textareaMessage" v-model="message" :readonly="disableMessage" :class="{disabled: disableMessage}" @keypress.enter="treatPress($event)" placeholder="Digite aqui..." rows="2" style="resize: none"></textarea>
            <div class="btn-sendMessage" :class="{disabled: disableMessage}" @click="treatSendMessage">
              <span class="glyphicon glyphicon-send"></span>
            </div>
          </div>
        </div>
        <div class="col-md-5 total-height cs-more-info" v-if="contact" v-show="showMoreInfo">
          <div class="title">
            <span class="close" @click="hideMoreInfo"><span aria-hidden="true">&times;</span></span>
            {{ titleInfo }}
          </div>
          <ContactTabulation v-show="titleInfo === 'Tabulação'" :contact="contact" />
          <ContactData v-show="titleInfo === 'Informações'" :contact="contact" />
        </div>
      </div>
    </div>
  </keep-alive>
</template>

<style lang="scss">
  .icon-grid{
    cursor: pointer;
    margin: 0 3px;
    &:hover{
      opacity: .8;
    }
  }
  .total-height{
    height: 100%;
  }
  .cs-separator{
    width: 1px;
    height: 18px;
    display: inline-block;
    background-color: #ccc;
    margin: 0 10px;
    vertical-align: top;
  }
  .cs-contact{
    height: 100%;
    .col-md-7{
      padding-right: 0;
    }
    .cs-contact-header{
      padding: 7px 10px 3px;
      border-bottom: 1px solid #ddd;
      .cs-contact-name{
        font-size: 1.2em;
      }
    }
    .cs-more-info{
      padding-left: 0;
      border-left: 1px solid #ddd;
      .title{
        padding: 7px 10px;
        background-color: #ddd;
        font-weight: bold;
      }
    }
  }
  .textMessage{
    margin-top: 5px;
    padding-left: 5px;
    position: relative;
    .textareaMessage{
      resize: none;
      display: inline-block;
      width: calc(100% - 50px);
      padding: 6px 12px;
      font-size: 14px;
      line-height: 1.42857143;
      color: #555;
      background-color: #fff;
      background-image: none;
      border: 1px solid #ccc;
      border-radius: 4px;
      -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
      box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
      -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
      -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
      transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
      &.disabled{
        background-color: #e2e2e2;
        &::-webkit-input-placeholder { /* Chrome */
          color: #b3b3b3;
        }
        &:-ms-input-placeholder { /* IE 10+ */
          color: #b3b3b3;
        }
        &::-moz-placeholder { /* Firefox 19+ */
          color: #b3b3b3;
          opacity: 1;
        }
        &:-moz-placeholder { /* Firefox 4 - 18 */
          color: #b3b3b3;
          opacity: 1;
        }
      }
    }
    .btn-sendMessage{
      position: absolute;
      right: 5px;
      top: 2px;
      cursor: pointer;
      border-radius: 50%;
      padding: 11px;
      font-size: 22px;
      width: 50px;
      height: 50px;
      background-color: #4b4b4b;
      color: #fff;
      &:hover{
        background-color: #4b4b4b;
      }
      &.disabled{
        background-color: #ccc;
        cursor: not-allowed;
      }
    }
  }
  .cs-conversation{
    overflow-y: auto;
    height: calc(100% - 97px);
    .cs-agent-dialog{
      margin: 5px;
      text-align: right;
      .cs-box-identify{
        vertical-align: top;
        font-size: 1em;
        .name{
          font-weight: bold;
        }
        .hour{
          color: #4b4b4b;
          font-size: .8em;
        }
      }
      .dialog{
        color: #555555;
        vertical-align: top;
      }
    }
    .cs-dialog-ballon-left{
      padding: 5px 10px;
      margin: 5px;
      background-color: #ffdaa9;
      border-radius: 7px;
      display: inline-block;
      .cs-box-identify{
        vertical-align: top;
        font-size: 1em;
        .name{
          font-weight: bold;
        }
        .hour{
          color: #4b4b4b;
          font-size: .8em;
        }
      }
      .dialog{
        color: #555555;
        vertical-align: top;
        .hour{
          display: block;
          font-size: .8em;
          text-align: right;
        }
      }
    }
    .cs-dialog-ballon-right{
      margin: 5px;
      padding: 5px 10px;
      background-color: #b1d9f5;
      border-radius: 7px;
      display: inline-block;
      .cs-box-identify{
        vertical-align: top;
        font-size: 1em;
        .name{
          font-weight: bold;
        }
        .hour{
          color: #4b4b4b;
          font-size: .8em;
        }
      }
      .dialog{
        color: #555555;
        vertical-align: top;
        .hour{
          display: block;
          font-size: .8em;
          text-align: right;
        }
      }
    }
    .cs-dialog{
      margin: 5px;
      .cs-box-identify{
        vertical-align: top;
        font-size: 1em;
        .name{
          font-weight: bold;
        }
        .hour{
          color: #4b4b4b;
          font-size: .8em;
        }
      }
      .dialog{
        color: #555555;
        vertical-align: top;
      }
    }
    .cs-line-media{
      margin: 20px 0;
      border-top: 1px solid #ddd;
      text-align: center;
      padding: 3px;
      .cs-icon-media{
        vertical-align: middle;
        width: 16px;
        height: 16px;
        display: inline-block;
      }
      .cs-text-divider{
        vertical-align: middle;
        margin-left: 5px;
      }
    }
  }
  .icon-rcs{
    background: transparent url('../assets/chatrcs.png') center center / 100% auto no-repeat;
  }
  .icon-messenger{
    background: transparent url('../assets/messenger.png') center center / 100% auto no-repeat;
  }
  .icon-mobile{
    background: transparent url('../assets/chatmobile.png') center center / 100% auto no-repeat;
  }
  .icon-web{
    background: transparent url('../assets/chatweb.png') center center / 100% auto no-repeat;
  }
  .icon-telegram{
    background: transparent url('../assets/telegram.png') center center / 100% auto no-repeat;
  }
  .icon-whatsapp{
    background: transparent url('../assets/whatsapp.png') center center / 100% auto no-repeat;
  }
</style>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import {
    CsEvents, CsConverseLeft, CsConverseRight, CsWorkerTimer
  } from '@contactstudio/agent-tools';
  import ContactTabulation from '../components/ContactTabulation.vue';
  import ContactHistory from '../components/ContactHistory.vue';
  import ContactData from '../components/ContactData.vue';
  import ConverseMedia from '../components/ConverseMedia.vue';

  export default {
    components: {
      ContactTabulation,
      ContactHistory,
      ContactData,
      CsConverseRight,
      CsConverseLeft,
      ConverseMedia,
      CsWorkerTimer
    },
    data(){
      return {
        titleInfo: 'Tabulação',
        showMoreInfo: true,
        contact: null,
        contactName: null,
        dialogs: [
          {send: 'media', media: 'CONTACT_STUDIO_MESSENGER', hour: new Date()},
          /*{send: 'agent', text: 'Meu texto do agente.', hour: new Date()},
          {send: 'visitor', text: 'Meu texto do visitante.', hour: new Date()},*/
        ],
        message: '',
        disableMessage: false,
      }
    },
    created(){
      if(this.$route.params.contact){
        this.contact = this.$route.params.contact;
        this.contactName = this.$route.params.contactName;
        let cont = this.contact.contact_point.split('@visitors')[0];
        CsEvents.$on(`NewMessageFrom_${cont}`, this.treatMessageReceived)
      }
      else{
        CsEvents.$on('ChangeSnapshot', this.loadContact);
      }
    },
    beforeDestroy(){
      let cont = this.contact.contact_point.split('@visitors')[0];
      CsEvents.$off(`NewMessageFrom_${cont}`, this.treatMessageReceived)
    },
    mounted(){
      this.contact = this.$route.params.contact;
      this.contactName = this.$route.params.contactName;
    },
    computed: mapGetters('lib', ['getSnapshot']),
    methods: {
      getContactName(cont){
        return cont.contact_point.split('@visitors')[0].split('__at__')[0];
      },
      loadContact(snap){
        let id = this.$route.params.id;
        let contato = snap.contacts.filter(cont => {
          return (cont.contact_id === id);
        });
        if(contato.length > 0){
          this.contact = contato[0];
          this.contactName = this.getContactName(contato[0]);
          let cont = this.contact.contact_point.split('@visitors')[0];
          CsEvents.$on(`NewMessageFrom_${cont}`, this.treatMessageReceived);
        }
        CsEvents.$off('ChangeSnapshot', this.loadContact);
      },
      treatPress(evt){
        this.treatSendMessage();
        evt.stopPropagation();
      },
      treatSendMessage(){
        if(this.message){
          this.sendMessage(this.message);
        }
      },
      sendMessage(text){
        let objSend = {
          subject: "INSTANT_MESSAGING",
          body:  {
            media_id: this.contact.media_id,
            contact_id: this.contact.contact_id,
            identification: "CSMESSENGER",
            message: {
              type: "TEXT",
              message_text: text,
              params: null
            }
          }
        };
        setTimeout(() => {
          this.message = '';
        }, 800);
        CsEvents.$emit('SendMessageWS', objSend);
        this.incrementDialog({sender: 'agent', text: this.message});
      },
      treatMessageReceived(msg){
        if(msg.body.message.message_text !== 'init'){
          this.incrementDialog({sender: 'visitor', text: msg.body.message.message_text})
        }
      },
      incrementDialog(obj){
        this.dialogs.push({
          send: obj.sender,
          text: obj.text,
          hour: new Date()
        });
        setTimeout(() => {
          window.$(".cs-conversation").animate({
            scrollTop: window.$(".cs-conversation")[0].scrollHeight
          }, 500);
        }, 500);
      },
      moreInfo(info){
        this.titleInfo = info;
        this.showMoreInfo = true;
      },
      hideMoreInfo(){
        this.titleInfo = null;
        this.showMoreInfo = false;
      }
    }
  }
</script>
