document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    alert("Lancement Application terminé");

    if(localStorage.getItem("LocalData") == null)
    {
        var data = [];
        data = JSON.stringify(data);
        localStorage.setItem("LocalData", data);
    }

    $("#btn1").on("click",function(){
        //Appel à la fonction qui traite le scan
        scan();
    });

    $(document).on("pagebeforeshow", "#display", function() {
        $("table#allTable tbody").empty();

        var data = localStorage.getItem("LocalData");
        console.log(data);
        data = JSON.parse(data);

        var html = "";

        for(var count = 0; count < data.length; count++)
        {
            html = html + "<tr><td>" + data[count][0] + "</td><td>" + data[count][1] + "</a></td></tr>";

        }

        $("table#allTable tbody").append(html).closest("table#allTable").table("refresh").trigger("create");

    });

    function openURL(url)
    {
        alert("ouverture");
        window.open(url, '_blank', 'location=yes');
    }

    BtnAffichageFiche();

    BtnRetourFiche();

    BtnModifSalle();

    BtnDeconnexion();

    clickSalle();
};
//-------------Fin OnDeviceReady----------//

//-------------Fonction Deconnexion ------//
function BtnDeconnexion() {
        $("#btnDeconnexion").on("click", function(){
            $( this ).removeClass( "login" );
            $( this ).addClass( "logout" );
            $.mobile.pageContainer.pagecontainer("change", "#page1");
        });
    }

function BtnAffichageFiche() {
    $("#pageMateriel").on("click", function(){
        $("#tableData").empty();
        recupDataFiche();
    });
}

function BtnRetourFiche() {
    $("#pageFiche").on("click", function(){
        //$("#tableData").empty();
        $.mobile.pageContainer.pagecontainer("change", "#page3");
    });
}

function BtnModifSalle() {
    $("#btnModifSalle").on("click", function(){
        $("#sallelist").empty();
        recupDataSalle();
    });
}

//-------------Fonction Recup Data fiche --------//
function recupDataFiche() {
    // alert("Fct RecupData");
    //Partie recuperation data
    $.ajax({
        type: "GET",
        url:"http://jeanbenjamin.free.fr/php/json_send_data.php",
        success:function(data)
        {
            $.each(data, function(idx, item)
            {
                if (item.nom == "Norgeot") {
                    // alert(item.nom);
                    // alert(item.prenom);
                    // alert(item.adresse);
                    // alert(item.ville);

                $("#tableData").append(
                    '<tr>'+
                        '<td align="right"><label for="materielType">Type :</label></td>'+
                        '<td align="left"><output id="materielType" form="ficheMateriel">'+item.nom+'</output></td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td align="right"><label for="materielMarque">Marque :</label></td>'+
                        '<td align="left"><output id="materielMarque" form="ficheMateriel">'+item.prenom+'</output></td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td align="right"><label for="materielModele">Modele :</label></td>'+
                        '<td align="left"><output id="materielModele" form="ficheMateriel">'+item.adresse+'</output></td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td align="right"><label for="materielNumSerie">Numero Serie :</label></td>'+
                        '<td align="left"><output id="materielNumSerie" form="ficheMateriel">'+item.ville+'</output></td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td align="right"><label for="materielProcesseur">Processeur :</label></td>'+
                        '<td align="left"><output id="materielProcesseur" form="ficheMateriel">Valeur Test</output></td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td align="right"><label for="materielCarteMere">Carte Mere :</label></td>'+
                        '<td align="left"><output id="materielCarteMere" form="ficheMateriel">Valeur Test</output></td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td align="right"><label for="materielRam">Ram (Gb) :</label></td>'+
                        '<td align="left"><output id="materielRam" form="ficheMateriel">Valeur Test</output></td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td align="right"><label for="materielDd">DD (Gb) :</label></td>'+
                        '<td align="left"><output id="materielDd" form="ficheMateriel">Valeur Test</output></td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td align="right"><label for="materielSalle">Salle :</label></td>'+
                        '<td align="left"><output id="materielSalle" form="ficheMateriel">Valeur Test</output></td>'+
                    '</tr>'
                );
                }
            })
        },
        error:function(xhr,textStatus,err)
        {
            alert("readyState: "+xhr.readyState);
        }
    });
}

//-------------Fonction Recup data Salle--//
function recupDataSalle() {
    //alert("fct recup salle");
    $.ajax({
        type: "GET",
        url:"http://jeanbenjamin.free.fr/php/json_send_data.php",
        success:function(data)
        {
            $.each(data, function(idx, item)
            {
                $("#sallelist").append(
                    '<ul data-role="collapsible" data-iconpos="right" data-inset="false">'+
                        '<ul data-role="listview">'+
                            '<li>'+item.nom+'</li>'+
                        '</ul>'+
                    '</ul>'
                );
            })
        },
        error:function(xhr,textStatus,err)
        {
            alert("readyState: "+xhr.readyState);
        }
});
}

function clickSalle(){
    $("#sallelist").on('click', 'li', function () {
        //alert("click OK");
        var reponse = confirm("Vous avez selectionner la salle: "+ $(this).text()+ ", Confirmer ?");
        var newSalle = $(this).text();
        if (reponse) {
            //alert("OK");
            //alert(newSalle);
            $("#materielSalle").val(newSalle);
            $.mobile.pageContainer.pagecontainer("change", "#page3");
            //requete MAJ sur BDD
        }
    });
}

//-------------Fonction Scan--------------//
function scan()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if(!result.cancelled)
            {
                if(result.format == "QR_CODE")
                {
                    navigator.notification.prompt("Saisir le nom des données",  function(input){
                        var name = input.input1;
                        var value = result.text;

                        var data = localStorage.getItem("LocalData");
                        console.log(data);
                        data = JSON.parse(data);
                        data[data.length] = [name, value];

                        localStorage.setItem("LocalData", JSON.stringify(data));

                        alert("Element ajouté avec succès");
                    });
                }else{
                    navigator.notification.alert('Code Scan Attendu: QR_CODE \n  Type de Code Scanné: '+result.format+'\nResultat reçu: '+result.text,null,'Erreur de format','Ok');
                }
            }
            else
            {
                 alert("Vous avez annulé le scan");
            }
        },
        function (error) {
            alert("Erreur de scan: " + error);
        }
   );
}
//----------Fin de la fonction de scan de l'application ------//