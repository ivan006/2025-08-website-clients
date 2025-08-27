import { createStore } from 'vuex'
import VuexORM from '@vuex-orm/core'

// import { DBCrudCacheSet } from 'wizweb-fe';

import RouteLineage  from "src/models/RouteLineage";

import Header_Singleton from "src/models/orm-api/Header_Singleton";
import Footer_Singleton from "src/models/orm-api/Footer_Singleton";
import Menu_Items from "src/models/orm-api/Menu_Items";
import TestEntity from "src/models/orm-api/TestEntity";



// Initialize the database
const database = new VuexORM.Database()

// Register models
// database.register(DBCrudCacheSet);

database.register(RouteLineage)
database.register(Header_Singleton)
database.register(Footer_Singleton)
database.register(Menu_Items)
database.register(TestEntity)



// Create Vuex store
const store = createStore({
  plugins: [VuexORM.install(database)]
})

export default store
