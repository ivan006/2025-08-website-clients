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
    const params = new URLSearchParams({
      limit: options.limit,
      offset,
      ...flags,
      ...options.filters,
    });

    // ✅ Encode the inner Airtable request
    const encodedInner = encodeURIComponent(`${airtableUrl}?${params.toString()}`);

    // ✅ Build the final proxy URL
    const finalUrl = `${proxyBase}${encodedInner}`;

    // ✅ Call proxy
    return this.customApiBase(headers).get(finalUrl, { save: false });
  }


  static FetchById(id, relationships = [], flags = {}, moreHeaders = {}) {
    const proxyBase = import.meta.env.VITE_API_PROXY_URL;      // e.g. https://capetownlists.co.za/?url=
    const airtableBase = import.meta.env.VITE_API_BACKEND_URL; // e.g. https://api.airtable.com/v0/appVY1Zwf71mOzczr
    const headers = this.mergeHeaders(moreHeaders);

    // 1️⃣ Build the raw Airtable URL
    const airtableUrl = `${airtableBase}${this.entityUrl}/${id}`;

    // 2️⃣ Add optional query params (if flags or relationships exist)
    const params = new URLSearchParams({
      ...flags,
      ...(relationships.length ? { with: relationships.join(',') } : {}),
    });

    // 3️⃣ Encode the inner Airtable URL
    const encodedInner = encodeURIComponent(
      params.toString() ? `${airtableUrl}?${params.toString()}` : airtableUrl
    );

    // 4️⃣ Final proxy URL
    const finalUrl = `${proxyBase}${encodedInner}`;

    // 5️⃣ Make the request through proxy
    return this.customApiBase(headers).get(finalUrl, {
      save: false,
    });
  }



}
