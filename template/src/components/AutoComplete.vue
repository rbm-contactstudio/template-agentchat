<template>
  <div style="position:relative" :class="{'open':openSuggestion}">
    <div class="form-group">
      <div class="input-group">
        <input class="form-control" type="text" v-model="selection"
               :placeholder="placeholder"
               @keydown.enter = 'enter'
               @keydown.down = 'down'
               @keydown.up = 'up'
               @input = 'change'
        />
        <div class="input-group-addon"><span class="glyphicon glyphicon-search"></span></div>
      </div>
    </div>
    <ul class="dropdown-menu" style="width: 100%">
      <li v-for="(suggestion, $index) in matches" :class="{'active': isActive($index)}" @click.prevent="suggestionClick($index)">
        <a href="#">{{ suggestion }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props:{
      suggestions:{
        type: Array,
        required: true
      },
      field:{
        type: String,
        required: false
      },
      placeholder:{
        type: String,
        required: false
      },
      event:{
        type: String,
        required: true
      }
    },
    watch:{
      'selection': 'changeSelection'
    },
    data(){
      return{
        open: false,
        current: 0,
        selection: null
      }
    },
    computed:{
      matches(){
        let arr = [];
        if(this.field){
          this.suggestions.forEach(item => {
            arr.push(item[this.field]);
          })
        }
        else{
          arr = this.suggestions
        }
        let sugs = arr.filter((str) => {
          if(str && this.selection){
            if(typeof str === 'string'){
              return str.toLowerCase().indexOf(this.selection.toLowerCase()) >= 0;
            }
            else{
              str[this.field].toLowerCase().indexOf(this.selection.toLowerCase()) >= 0;
            }
          }
        });
        return sugs;
      },
      openSuggestion(){
        return this.selection !== "" && this.matches.length != 0 && this.open === true;
      }
    },
    methods:{
      clearValue(){
        this.selection = '';
      },
      changeSelection(){
        let data = this.selection;
        if(this.field){
          data = null;
          this.suggestions.forEach(item => {
            if(!data && item[this.field] === this.selection){
              data = item;
            }
          });
        }
        this.$emit(this.event, data);
      },
      enter(){
        this.selection = this.matches[this.current];
        this.open = false;
      },
      up(){
        if(this.current > 0)
          this.current--;
      },
      down(){
        if(this.current < this.matches.length - 1)
          this.current++;
      },
      isActive(index){
        return index === this.current;
      },
      change(){
        if (this.open == false){
          this.open = true;
          this.current = 0;
        }
      },
      suggestionClick(index){
        this.selection = this.matches[index];
        this.open = false;
      }
    }
  }
</script>