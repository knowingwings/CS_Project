import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Login"); 
    }

    async getHtml() { // html to be inserted
        const func = this.params.func;
        const ID = this.params.id;

        if (func=="createMatch"){
            console.log("Viewing ")
        }
        else if(func=="share"){
            console.log('localhost:2040/response/reply/'+ ID)
        }
        else if(func=="reply"){
            console.log("Viewing reply")
            //TODO
            /*
            Fetch team members from Db as well as the match data for that ID from the responsesDB
            populate "Name" Drop down with team member names as options
            populate "startTime" drop down with range of time for the first 4 hours from the startTime till the endTime
            populate "endTime" drop down with range of times ignoring the first 2 hours till the endTime
            populate "other" drop down with data from matchDB
            input Buzzword segment
            Submit form
            */
        }
        else if(func=="viewResponses"){
            console.log("Viewing viewResponses")
        }
    }
}