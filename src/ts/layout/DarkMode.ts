class DarkMode {
    static init(){
        if (localStorage.getItem('ylide-dark')==='true') {
            $('body').addClass('dark-mode');
            $('.main-header').removeClass('navbar-light');
            $('.main-header').addClass('navbar-dark');
            $('#sidebar-dark').addClass('d-none');
        } else {
            $('#sidebar-light').addClass('d-none');
        }
    };

    static addDark() {
        $('body').addClass('dark-mode');
        $('.main-header').removeClass('navbar-light');
        $('.main-header').addClass('navbar-dark');
        $('#sidebar-dark').addClass('d-none');
        $('#sidebar-light').removeClass('d-none');
        localStorage.setItem('ylide-dark', 'true');      
    }

    static delDark() {
        $('body').removeClass('dark-mode');
        $('.main-header').addClass('navbar-light');
        $('.main-header').removeClass('navbar-dark');
        $('#sidebar-dark').removeClass('d-none');
        $('#sidebar-light').addClass('d-none');
        localStorage.setItem('ylide-dark', 'false');  
    }
}


export default DarkMode;