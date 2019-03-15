import Vue from "vue";

declare module "*.vue" {

  export default Vue;
}

import {AxiosInstance} from "axios";

declare module 'vue/types/vue' {
    // Global properties can be declared
    // on the `VueConstructor` interface

    interface VueConstructor {
        $axios: AxiosInstance
    }
}
