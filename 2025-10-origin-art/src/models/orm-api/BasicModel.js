import { Model } from '@vuex-orm/core'

export default class BasicModel extends Model {

  static entityUrl = '';

  static baseUrl = import.meta.env.VITE_API_BACKEND_URL

  static defaultFlags = {}

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

  static flattenParams(obj, prefix = '') {
    const result = {}
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(result, this.flattenParams(value, newKey))
      } else {
        result[newKey] = Array.isArray(value) ? value.join(',') : value
      }
    }
    return result
  }

  static FetchAll(
    relationships = [],
    flags = {},
    moreHeaders = {},
    options = { page: 1, limit: 15, filters: {}, clearPrimaryModelOnly: false }
  ) {
    const proxyBase = import.meta.env.VITE_API_PROXY_URL;      // cache/proxy
    const airtableBase = import.meta.env.VITE_API_BACKEND_URL; // real API
    const headers = this.mergeHeaders(moreHeaders);

    const offset = (options.page - 1) * options.limit;

    // ✅ Build Airtable URL
    const airtableUrl = `${airtableBase}${this.entityUrl}`;

    // ✅ Flatten params to prevent [object Object]

    const flatParams = this.flattenParams({
      limit: options.limit,
      offset,
      ...flags,
      ...this.defaultFlags,
      ...options.filters,
    });

    // ✅ Build query string
    const queryString = new URLSearchParams(flatParams).toString();

    // ✅ Encode the full inner URL
    const encodedInner = encodeURIComponent(`${airtableUrl}?${queryString}`);

    // ✅ Final proxy URL
    const finalUrl = `${proxyBase}${encodedInner}`;

    // ✅ Call proxy
    return this.customApiBase(headers).get(finalUrl, { save: false });
  }


  static FetchById(id, relationships = [], flags = {}, moreHeaders = {}) {
    const proxyBase = import.meta.env.VITE_API_PROXY_URL;
    const airtableBase = import.meta.env.VITE_API_BACKEND_URL;
    const headers = this.mergeHeaders(moreHeaders);

    // ✅ Build base Airtable URL
    const airtableUrl = `${airtableBase}${this.entityUrl}/${id}`;

    // ✅ Flatten query params to prevent [object Object]
    const flatParams = this.flattenParams({
      ...flags,
      ...(relationships.length ? { with: relationships.join(',') } : {}),
    });

    // ✅ Build query string if any
    const queryString = new URLSearchParams(flatParams).toString();

    // ✅ Encode full inner URL
    const encodedInner = encodeURIComponent(
      queryString ? `${airtableUrl}?${queryString}` : airtableUrl
    );

    // ✅ Final proxy URL
    const finalUrl = `${proxyBase}${encodedInner}`;

    // ✅ Make the request through proxy
    return this.customApiBase(headers).get(finalUrl, { save: false });
  }




}
