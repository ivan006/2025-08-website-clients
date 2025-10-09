import { Model } from '@vuex-orm/core'

export default class BasicModel extends Model {

  static entityUrl = '';

  static baseUrl = import.meta.env.VITE_API_BACKEND_URL


  static mergeHeaders(headers) {
    const result = {
      ...headers,
    };

    // result['Authorization'] = `Bearer ${import.meta.env.VITE_API_AIRTABLE_KEY}`;

    return result;
  }

  static customApiBase(moreHeaders) {
    this.apiConfig = {
      baseURL: "",
      headers: {
        ...moreHeaders,
      },
    }
    return this.api()
  }

  static FetchAll(relationships = [], flags = {}, moreHeaders = {}, options = { page: 1, limit: 15, filters: {}, clearPrimaryModelOnly: false }) {

    const url = `${this.baseUrl}${this.entityUrl}`

    const headers = this.mergeHeaders(moreHeaders)

    let offset = (options.page - 1) * options.limit
    // todo: note - i hade to put the filters in line because urls can have duplicates keys and objects cans and i needed duplicates key support for the date range filter

    let computedUrl = url
    let preparedRels = {}
    let filtersObj = {}

    computedUrl = url;

    const result = this.customApiBase(headers)
      .get(computedUrl, {
        // persistBy: 'insertOrUpdate',
        save: false,
        params: {
          ...{
            limit: options.limit,
            offset: offset,
          },
          ...flags,
          ...preparedRels,
          ...filtersObj
        },
        // dataTransformer: ({ data }) => {
        //   if (options.clearPrimaryModelOnly) {
        //     this.deleteAll()
        //   }
        //   console.log('url3')
        //   console.log(url)
        //   const result = data.records.map(record => {
        //     return {
        //       id: record.id,
        //       createdTime: record.createdTime,
        //       ...record.fields
        //     };
        //   });
        //   return result
        // },
      })

    return result
  }

  static FetchById(id, relationships = [], flags = {}, moreHeaders = {}) {



    const url = `${this.baseUrl}${this.entityUrl}`
    const headers = this.mergeHeaders(moreHeaders)
    let computedUrl = url
    let preparedRels = {}


    computedUrl = `${url}/${id}`;
    preparedRels = {}; // likely still returns {}

    return this.customApiBase(headers)
      .get(computedUrl, {
        save: false,
        params: {
          ...preparedRels,
        },
        // dataTransformer: ({ data }) => {
        //   // const result = this.NormalizeRecursive(data)
        //   const result = {
        //     id: data.id,
        //     createdTime: data.createdTime,
        //     ...data.fields
        //   };
        //   return result
        // },
      })


  }


}
