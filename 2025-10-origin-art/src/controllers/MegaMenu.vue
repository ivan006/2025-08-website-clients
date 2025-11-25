<template>
    <div class="row items-center no-wrap">

        <!-- Top-level items -->
        <div v-for="item in menuData" :key="item.id" class="q-mx-md relative-position"
            @mouseenter="item.children?.length && show(item.id)">

            <!-- Normal top-level -->
            <router-link v-if="!item.children || !item.children.length" :to="item.url"
                class="text-primary text-weight-medium">
                {{ item.label }}
            </router-link>

            <!-- Has children -->
            <span v-else class="text-primary text-weight-medium cursor-pointer">
                {{ item.label }}
            </span>

            <!-- Mega menu -->
            <q-menu
                v-if="item.children && item.children.length"
                v-model="openMenus[item.id]"
                persistent
                anchor="bottom middle" 
                self="top middle"       
                transition-show="fade"
                transition-hide="fade"
                fit    
                :content-style="{ padding: '0', width: '100vw' }"  
            >

                <!-- FULL WIDTH BACKGROUND -->
                <div class="bg-white" style="width: 100vw;" @mouseleave="hide(item.id)">

                    <!-- CENTERED CONTAINER -->
                    <div class="container-md q-py-xl">

                        <div class="row q-col-gutter-xl">

                            <!-- Level 2 columns -->
                            <div v-for="mid in item.children" :key="mid.id" class="col-3">
                                <div class="text-bold q-mb-xs">
                                    {{ mid.label }}
                                    <router-link :to="mid.url" class="q-ml-sm text-primary">(All)</router-link>
                                </div>

                                <!-- Level 3 -->
                                <q-list dense padding>
                                    <q-item v-for="leaf in mid.children" :key="leaf.id" clickable :to="leaf.url"
                                        class="q-pl-none">
                                        <q-item-section>{{ leaf.label }}</q-item-section>
                                    </q-item>
                                </q-list>
                            </div>

                        </div>

                    </div>

                </div>

            </q-menu>

        </div>

    </div>
</template>




<script>
import menuData from "./menu.json"

export default {
    name: "MegaMenu",

    data() {
        return {
            menuData,
            openMenus: {}
        }
    },

    methods: {
        show(id) {
            this.openMenus = { ...this.openMenus, [id]: true }
        },
        hide(id) {
            this.openMenus = { ...this.openMenus, [id]: false }
        }
    }
}
</script>
