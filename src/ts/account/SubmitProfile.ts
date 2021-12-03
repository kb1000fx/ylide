class SubmitProfile {
    public config:Record<string,any>;

    constructor(){
        this.config = {
            avatar: $("input[name='avatarRadio']:checked").val(),
            studentID: $("#studentID-input").val(),
            email: $("#email-input").val(),
            name: $("#name-input").val(),
            qq: $("#qq-input").val(),
        }
    }

    public submit(){
        console.log(this.config)
    }
}

export default SubmitProfile