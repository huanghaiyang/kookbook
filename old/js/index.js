window.onload = Inits ;
function Inits()
{
    ulChange("z_ul_bar");
    $("#search_btn").btnSearch() ;
    $("#z_man").modalLogin();
    $("#z_book_open").bookShow() ; 
    $("#z_man").parent().modalLoginWindow({
    	"topMargin" :1
    });
}



