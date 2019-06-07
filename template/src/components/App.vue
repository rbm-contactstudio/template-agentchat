<template>
  <div>
    <CsHeader />
    <div class="cs-box-menu">
      <CsChatMenuContact />
    </div>
    <div class="cs-content-contact">
      <keep-alive>
        <router-view :key="$route.fullPath"></router-view>
      </keep-alive>
    </div>
    <CsAlert />
    <CsSnapshot />
    <CsMessageManager />
    <CsWSConnection protocol="ws" port="80" host="172.20.1.196"
                    url="user_messaging" :query="queryWS" />
  </div>
</template>

<style lang="scss">
  hr{
    border-top: 1px solid #ccc;
  }
  .cs-box-menu {
    position: fixed;
    top: 60px;
    width: 200px;
    height: calc(100% - 60px);
    background-color: #6d6d6d;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 15px 0;
    .cs-menu-item{
      font-family: "Arial Rounded", sans-serif;
      color: #fff;
      cursor: pointer;
      display: block;
      padding: 2px 5px;
      margin: 1px 0;
      text-decoration: none;
      &:hover{
        background-color: rgba(0, 0, 0, .1);
        text-decoration: none;
      }
      .cs-menu-text{
        font-size: 1em;
      }
      .glyphicon{
        color: #00b400;
        font-size: .8em;
        margin-right: 3px;
      }
    }
  }
  .cs-menu-item.router-link-active{
    background-color: rgba(0, 0, 0, .5);
    color: #F2F2F2;
    text-decoration: none;
    .cs-menu-text, .glyphicon{
      color: #F2F2F2;
    }
    &:hover{
      background-color: rgba(0, 0, 0, .5);
      text-decoration: none;
    }
  }
  .cs-content-contact{
    position: fixed;
    top: 60px;
    left: 200px;
    width: calc(100% - 200px);
    height: calc(100% - 60px);
  }
</style>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { CsEvents, CsAlert, CsHeader, CsChatMenuContact, CsSnapshot, CsWSConnection, CsMessageManager } from '@contactstudio/agent-tools';

  export default {
    components: {
      CsAlert,
      CsHeader,
      CsChatMenuContact,
      CsSnapshot,
      CsWSConnection,
      CsMessageManager
    },
    data(){
      return {
      }
    },
    created(){
      this['set-session'](this.getSessionCs());
      this['get-user']();
    },
    watch:{
      getSnapshot: 'validateChanges',
      getUser: 'treatDataUser',
    },
    computed: Object.assign({},
      mapGetters('lib/', ['getSnapshot', 'getSession', 'getContact', 'getUser', 'getStatus', 'getNextStatus']),
      mapGetters([]),
      {
        queryWS(){
          return `?cssession=${this.getSession}`;
        }
      }
    ),
    methods: Object.assign({},
      mapActions('lib/', [
        'set-session', 'set-errorsession', 'get-user', 'set-contact',
        'set-status', 'set-menucontacts'
      ]),
      mapActions([]),
      {
        treatDataUser(){
          if(this.getUser.info_agente.service.auto_available){
            setTimeout(() => {
              if(this.getStatus == 'Indefinido' && this.getNextStatus == 'Disponível'){
                this.setAvailable();
              }
            }, 1000);
          }
          CsEvents.$emit('ConnectWS');
        },
        setAvailable(){
          this['set-status']('Disponível');
        },
        validateChanges(snap){
          if(snap.to_kill == '1'){
            let text = snap.to_kill_origin && snap.to_kill_origin != 'UNSOLICITED' ? `Deslogado pelo usuário "${snap.to_kill_origin}".` : 'Deslogado por meio desconhecido.';
            this['set-errorsession'](text);
          }
          CsEvents.$emit('ChangeSnapshot', snap);
          this.treatMenuContacts(snap);
        },
        getContactName(cont){
          return cont.contact_point.split('@visitors')[0].split('__at__')[0];
        },
        treatMenuContacts(snap){
          let menu = [];
          snap.contacts.forEach(cont => {
            menu.push({
              label: this.getContactName(cont),
              notread: 0,
              route: {
                name: 'contactitem',
                params: {
                  id: cont.contact_id,
                  contact: cont,
                  contactName: this.getContactName(cont)
                }
              }
            })
          })
          this['set-menucontacts'](menu);
        },
        getQueryString(){
          let result = {};
          if(location.search.length > 0){
            let pairs = (location.search).slice(1).split('&');
            for(let idx in pairs){
              let pair = pairs[idx].split('=');
              if(pair[0]){
                result[pair[0].toLowerCase()] = decodeURIComponent(pair[1] || '');
              }
            }
          }
          return result;
        },
        getCookies(){
          let cookies = document.cookie;
          if (cookies) {
            cookies = cookies.replace(/;[ ]/gi, '","');
            cookies = '{"' + cookies.replace(/=/gi, '":"') + '"}';
            return JSON.parse(cookies);
          }
          return {};
        },
        getSessionCs(){
          let allQueryString = this.getQueryString();
          let allCookies = this.getCookies();
          return allQueryString['cssession'] ? allQueryString['cssession'] : allCookies['cssession'];
        }
      }
    )
  }
</script>
