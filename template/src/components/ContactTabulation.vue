<template>
  <div class="max-height">
    <div class="cs-content content-height">
      <div class="form-group">
        <label>Classificações</label>
        <AutoComplete
          ref="autocomplete"
          :suggestions="classifications"
          field="classificacao"
          v-on:changeResult="changeClassify"
          event="changeResult"
          placeholder="Busque aqui o resultado do atendimento">
        </AutoComplete>
      </div>
      <div v-show="result">
        <label>Classificação selecionada</label>
        <ul class="arvorecaso">
          <li v-for="(arv, idx) in arvore" :key="idx"><span>{{ arv }}</span></li>
        </ul>
        <div class="text-center">
          <div class="btn btn-primary" @click="saveClassify">Gravar</div>
        </div>
      </div>
    </div>
    <div class="cs-footer">
      <div class="row">
        <div class="col-md-6">
          <label>Grupo</label>
          <select class="form-control" v-model="grupo">
            <option v-for="(opt, idx) in grupos" :key="idx" :value="opt">{{ opt.label }}</option>
          </select>
        </div>
        <div class="col-md-6">
          <label>Tabulação</label>
          <select class="form-control" v-model="tabulacao" :disabled="!grupo">
            <option v-for="(opt, idx) in grupo.tabulacoes" :key="idx" :value="opt">{{ opt.label }}</option>
          </select>
        </div>
      </div>
      <div class="text-center">
        <div class="btn btn-default spacetop" @click="tabulate">Tabular</div>
        <div class="btn btn-default spacetop spaceleft" @click="freeContact">Liberar</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  $colorArvore: #000;/*#153b92;*/
  .spacetop{
    margin-top: 5px;
  }
  .spaceleft{
    margin-left: 10px;
  }
  .max-height{
    height: 100%;
  }
  .content-height{
    overflow-y: auto;
    height: calc(100% - 146px);
  }
  .cs-content{
    padding: 10px;
  }
  .cs-footer{
    position: absolute;
    width: calc(100% - 15px);
    bottom: 0;
    padding: 7px;
    background-color: #CCCCCC;
  }
  .arvorecaso{
    padding: 0;
    list-style: none;
    overflow: hidden;
    font: 14px Sans-Serif;
    li:first-child span {
      padding-left: 20px;
    }
    li{
      float: left;
      span{
        color: white;
        text-decoration: none;
        padding: 10px 7px 10px 30px;
        background: $colorArvore;
        position: relative;
        display: block;
        float: left;
        text-transform: lowercase;
      }
      span::after {
        content: " ";
        display: block;
        width: 0;
        height: 0;
        border-top: 19px solid transparent;
        border-bottom: 19px solid transparent;
        border-left: 14px solid $colorArvore;
        position: absolute;
        top: 0;
        margin-top: -1px;
        left: 100%;
        z-index: 2;
      }
      span::before {
        content: " ";
        display: block;
        width: 0;
        height: 0;
        border-top: 18px solid transparent;
        border-bottom: 18px solid transparent;
        border-left: 17px solid white;
        position: absolute;
        top: 0;
        margin-top: 0;
        margin-left: 1px;
        left: 100%;
        z-index: 1;
      }
    }
  }

  @for $i from 2 through 8 {
    $colortemp: ($i*10);
    .arvorecaso li:nth-child(#{$i}) span{
      background: lighten($colorArvore, $colortemp);
      &::after{
        border-left-color: lighten($colorArvore, $colortemp) !important;
      }
    }
  }
</style>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { CsEvents } from '@contactstudio/agent-tools';
  import AutoComplete from './AutoComplete.vue';

  export default {
    components: {
      AutoComplete
    },
    props: {
      contact:{
        required: true,
        type: Object
      }
    },
    data(){
      return {
        expertise: null,
        result: false,
        arvore: [],
        tabulationsList: [],
        grupos: [],
        classificacao: null,
        classifications: [],
        grupo: '',
        tabulacao: ''
      }
    },
    created(){
      console.log(this.contact);
      this.grupos = this.contact.qualifications;
      this.expertise = this.contact.expertise;
      this['loadExpertise'](this.expertise).then(ret => {
        this.classifications = ret.data.lista && ret.data.lista[0]
          ? ret.data.lista[0].classificacoes : [];
      });
    },
    methods: Object.assign({},
      mapActions(['loadExpertise', 'saveExpertise', 'saveTabulation', 'clearContact']),
      {
        changeClassify(data){
          this.result = data;
          this.changeTreatmentCase();
        },
        changeTreatmentCase(){
          if(this.result){
            this.arvore = this.result.arvore.split('|');
          }
        },
        resetValuesCase(){
          this.result = '';
          this.arvore = [];
          this.$refs.autocomplete.clearValue();
        },
        saveClassify(){
          let data = {
            classificacao: this.result.classificacao,
            arvore: this.result.arvore
          };
          let objSend = {
            card_id: this.contact.card_id,
            contact_id: this.contact.contact_id,
            campaign: this.contact.campaign,
            expertise: this.contact.expertise,
            phase: this.contact.phase,
            data: data,
            mailing: this.contact.data,
            date_initial: this.contact.user_association_date
          };
          let me = this;
          this['saveExpertise'](objSend).then(ret => {
            if(ret.ok){
              CsEvents.$emit('showAlert', {
                text: 'Classificação gravada com sucesso!',
                success: true,
                time: 4000
              });
              //me.resetValuesCase();
            }
          });
        },
        formatTabulation(){
          let objBase = {
            tabulacao: this.tabulacao.nome,
            info_tab: {
              type: this.tabulacao.acao.tipo,
              label: this.tabulacao.label,
              group: this.grupo.nome,
              group_label: this.grupo.label
            },
            note: null,
            email_id: null,
            agendamento: null
          };

          if(this.tabulacao.acao.tipo == 'AGENDADOR' || this.tabulacao.acao.tipo == 'AFFINITY'){
            let agendamento = {
              enderecamento: this.telAgendamento,
              data_hora: {
                $date: this.dataAgendamento+'T'+this.horaAgendamento+":00.000"
              }
            };

            if(this.tabulacao && this.tabulacao.acao && this.tabulacao.acao.tipo == 'AFFINITY' && this.tabulacao.acao.usuario_seleciona_destino){
              agendamento.affinity_to = {};
              agendamento.affinity_to[this.tabulacao.acao.affinity_with] = this.affinityTo;
            }

            objBase.agendamento = agendamento;
          }
          else if(this.tabulacao.acao.tipo == 'FINALIZADOR'){
            objBase.info_tab.indica_sucesso_negocio = this.tabulacao.acao.indica_sucesso_negocio;
          }

          if(this.order && this.order.items && this.order.items.length > 0){
            objBase.order = this.order;
          }

          return objBase;
        },
        tabulate(){
          this['saveTabulation']({
            contact_id: this.contact.contact_id,
            tabulation: this.formatTabulation()
          }).then(ret => {
            if(ret.ok){
              CsEvents.$emit('showAlert', {
                text: 'Tabulação realizada com sucesso!',
                success: true,
                time: 6000
              });
            }
          })
        },
        freeContact(){
          this['clearContact']({contact_id: this.contact.contact_id}).then(ret => {
            if(ret.ok){
              CsEvents.$emit('showAlert', {
                text: 'Contato liberado!',
                success: true
              });
              this.$router.push({name: 'home'})
            }
          })
        }
      }
    )
  }
</script>