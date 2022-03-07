export default class {
    constructor(params) {
        this.params = params;
    }

    setTitle(title) {
        document.title = title; //sets the view title in the tab
    }

    async getHtml() { // html to inserted here
        return "";
    }

    async postData(url, data) {
        var myHeaders = new Headers({'Content-Type': 'application/json'})    
        // Default options are marked with *
        const response = await fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          headers: myHeaders,
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: data, // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }
}