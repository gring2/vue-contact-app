<template>
  <div id="container">
    <div class="page-header">
      <h1 class="text-center">Contact Manage App</h1>
      <p>(Dynamic Component  + EventBus + Axios)</p>
    </div>
    <component :is="currentView" :contact="contact"></component>
    <contactList :contactlist="contactlist"></contactList>
    <paginate ref="pagebuttons" :page-count="totalpage" :page-range="7" :margin-pages="3" :click-handler="pageChanged"
              :prev-text="'Prev'" :next-text="'Next'" :container-class="'pagination'" :page-class="'page-item'"></paginate>
  </div>
</template>
<!--suppress TypeScriptCheckImport, TypeScriptUnresolvedFunction, TypeScriptUnresolvedVariable -->
<script lang="ts">

  import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
  import ContactList from "@/components/ContactList"
  import AddContact from "@/components/AddContact"
  import UpdateContact from "@/components/UpdateContact"
  import UpdatePhoto from "@/components/UpdatePhoto"
  import CONF from "@/Config"
  import eventBus from "@/EventBus"
  import Paginate from 'vuejs-paginate'

  @Component({
          components: {ContactList, AddContact, UpdateContact, UpdatePhoto, Paginate}
  })
  export default class App extends Vue {

    currentView: string| null = null;
    contact = {no: 0, name: '', te: '', address: '', photo: ''};
    contactlist = {pageno: 1, pagesize: CONF.PAGESIZE, totalcount: 0, contacts: []};
    mounted(){
      this.fetchContacts()
        eventBus.$on("cancel", () => {
            this.currentView = null
        });

        eventBus.$on("addSubmit", (contact) => {
            this.currentView = null;
            this.addContact(contact)
        });

        eventBus.$on("updateSubmit", (contact) => {
            this.currentView = null;
            this.updateContact(contact)
        });

        eventBus.$on("addContactForm", () => {
            this.currentView = 'addContact'
        });

        eventBus.$on("editContactForm", (no) => {
            this.fetchContactOne(no);
            this.currentView = "updateContact"
        });

        eventBus.$on("deleteContact", (no) => {
            this.deleteContact(no)
        });

        eventBus.$on("editPhoto", (no) => {
            this.fetchContactOne(no);
            this.currentView = "updatePhoto"
        });

        eventBus.$on("updatePhoto", (no, file) => {
            if (file){
                this.updatePhoto(no ,file)
            }
            this.currentView = null
        })
    }

    get totalpage(): number {
        return Math.floor((this.contactlist.totalcount - 1) / this.contactlist.pagesize) + 1
    }

    @Watch('contactlist.pageno')
    onContactListPagenoChange(){
        this.$refs.pagebuttons.selected = this.contactlist.pageno - 1
    }
    pageChanged(page) {
        this.contactlist.pageno = page;
        this.fetchContacts()
    }
    async fetchContacts(){
        try{
            const contactlist = await this.$axios.get(CONF.FETCH, {
                params: {
                    pageno: this.contactlist.pageno,
                    pagesize: this.contactlist.pagesize
                }
            });
            this.contactlist = contactlist.data

        }catch (e) {
            console.error('fetchContacts failed', e);
            this.contactlist.contacts = []
        }

    }

    async addContact(contact) {
        try{
            await this.$axios.post(CONF.ADD, contact);
            this.contactlist.pageno = 1;
            this.fetchContacts()
        }catch (e) {
            console.error('addContact failed', e)
        }
    }

    async updateContact(contact) {
        try{
            await this.$axios.put(CONF.UPDATE.replace("${no}", contact.no), contact);
            this.fetchContacts()
        }catch (e) {
            console.error('updateContact failed', e)
        }
    }

    async fetchContactOne(no) {
        try{
            const contact = this.$axios.get(CONF.FETCH_ONE.replace("${no}", no));
            this.contact = contact.data
        }catch (e) {
            console.error('fetchContactOne failed', e)
        }
    }

    async deleteContact(no) {
        try{
            this.$axios.delete(CONF.DELETE.replace("${no}", no));
            this.fetchContacts()
        }catch (e) {
            console.error('delete faeild', e)
        }
    }

    async updatePhoto(no, file) {
      try{
          const data = new FormData();
          data.append('photo', file);
          this.$axios.post(CONF.UPDATE_PHOTO.replace("${no}", no), data);
          this.fetchContacts()
      }catch (e) {
          console.error("updatePhoto failed", e)
      }

    }

  }
</script>
<style scoped>
</style>
<style lang="scss" scoped >
@import '~bootstrap/dist/css/bootstrap.min.css';

  #container{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>

