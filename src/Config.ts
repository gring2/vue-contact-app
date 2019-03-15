const BASE_URL: string = "/api";

export default {
    ADD: `${BASE_URL}/contacts`,
    DELETE : BASE_URL + "/contacts/${no}",
    FETCH: `${BASE_URL}/contacts`,
    FETCH_ONE : BASE_URL + "/contacts/${no}",
    PAGESIZE: 5,
    UPDATE: BASE_URL + "/contacts/${no}",
    UPDATE_PHOTO : BASE_URL + "/contacts/${no}/photo",

};
