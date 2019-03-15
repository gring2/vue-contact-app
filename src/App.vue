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
  import { Component, Prop, Emit, Watch, Vue } from "vue-property-decorator";
  import ContactList from "@/components/ContactList.vue";
  import AddContact from "@/components/AddContact.vue";
  import UpdateContact from "@/components/UpdateContact.vue";
  import UpdatePhoto from "@/components/UpdatePhoto.vue";
  import CONF from "@/Config";
  import eventBus from "@/EventBus";
  import Paginate from "vuejs-paginate";

  @Component({
    components: { ContactList, AddContact, UpdateContact, UpdatePhoto, Paginate, }

  })

  export default class App extends Vue {

    public $refs!: {
        pagebuttons: HTMLFormElement
    }
    private $axios = Vue.$axios
    private currentView: string| null = null;
    private contact: Dict = {no: 0, name: '', te: '', address: '', photo: ''};
    private contactlist: Dict = {pageno: 1, pagesize: CONF.PAGESIZE, totalcount: 0, contacts: []};

    public mounted() {
      this.fetchContacts()
      eventBus.$on("cancel", () => {
          this.currentView = null
      });

      eventBus.$on("addSubmit", (contact: any) => {
          this.currentView = null;
          this.addContact(contact)
      });

      eventBus.$on("updateSubmit", (contact: any) => {
          this.currentView = null;
          this.updateContact(contact)
      });

      eventBus.$on("addContactForm", () => {
          this.currentView = 'addContact'
      });

      eventBus.$on("editContactForm", (no: string) => {
          this.fetchContactOne(no);
          this.currentView = "updateContact"
      });

      eventBus.$on("deleteContact", (no: string) => {
          this.deleteContact(no)
      });

      eventBus.$on("editPhoto", (no: string) => {
          this.fetchContactOne(no);
          this.currentView = "updatePhoto"
      });

      eventBus.$on("updatePhoto", (no: string, file: File) => {
          if ( file ) {
              this.updatePhoto(no, file)
          }
          this.currentView = null
      })
    }

    private get totalpage(): number {
        return Math.floor((this.contactlist.totalcount - 1) / this.contactlist.pagesize) + 1
    }

    @Watch('contactlist.pageno')
    private onContactListPagenoChange() {
        this.$refs.pagebuttons.selected = this.contactlist.pageno - 1
    }
    private pageChanged(page: any) {
        this.contactlist.pageno = page;
        this.fetchContacts()
    }
    private async fetchContacts() {
        try {
            const contactlist = await this.$axios.get(CONF.FETCH, {
                params: {
                    pageno: this.contactlist.pageno,
                    pagesize: this.contactlist.pagesize,
                }
            });
            this.contactlist = contactlist.data;

        } catch (e) {
            console.error('fetchContacts failed', e);
            this.contactlist.contacts = []
        }

    }

    private async addContact(contact: any) {
        try {
            await this.$axios.post(CONF.ADD, contact);
            this.contactlist.pageno = 1;
            this.fetchContacts()
        } catch (e) {
            console.error('addContact failed', e)
        }
    }

    private async updateContact(contact: any) {
        try {
            await this.$axios.put(CONF.UPDATE.replace("${no}", contact.no), contact);
            this.fetchContacts()
        } catch (e) {
            console.error('updateContact failed', e)
        }
    }

    private async fetchContactOne(no: string) {
        try {
            const contact = await this.$axios.get(CONF.FETCH_ONE.replace("${no}", no));
            this.contact = contact.data
        } catch (e) {
            console.error('fetchContactOne failed', e)
        }
    }

    private async deleteContact(no: string) {
        try {
            this.$axios.delete(CONF.DELETE.replace("${no}", no));
            this.fetchContacts()
        } catch (e) {
            console.error('delete faeild', e)
        }
    }

    private async updatePhoto(no: string, file: File) {
        try {
          const data = new FormData();
          data.append('photo', file);
          this.$axios.post(CONF.UPDATE_PHOTO.replace("${no}", no), data);
          this.fetchContacts()
      } catch (e) {
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

