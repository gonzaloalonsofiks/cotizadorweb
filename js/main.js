// Document ready
$(document).ready(function(){

    // Selección de elementos del DOM

    const form = $('#form');
    const inputAccount = $('#form__accountName');
    const inputDate = $('#form__date');
    const inputClientType = $('#form__clientType');
    const inputCurrency = $('#form__currency');
    const inputSiteType = $('#form__siteType');


    // Constructor de Quotes
    
    function Quote(accountName, date, clientType, currency, siteType){
        this.accountName = accountName;
        this.date = date;
        this.clientType = clientType;
        this.currency = currency;
        this.siteType = siteType;
    }

    //Leer JSON (recomendado por Nico)

    /* function leerJson(){
        let xhr= new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(this.readyState==4 && this.status==200){
                console.log(this.responseText)
            }
        }
        xhr.open('POST', 'json/services.json', true);
        xhr.send();
    }
    leerJson(); */

    //Importar JSON de servicios con API

    const JSONGET = "json/services.json";


    $('#getRates').click(function (e) { 
        $.get(JSONGET, function (answer, status) {
            if (status === "success"){
                let allData = answer;
                for (const data of allData){
                    $('.ratesArea').append(`
                        <h5>Nombre del servicio: <span>${data.service_description}</span></h5> 
                        <p>Precio $ ${data.service_price}</p>
                        `);
                }
            }
            
        })
    });
    
    // Array de servicios desde JSON
    let servicesArray = [];
    
    $.getJSON('json/services.json', function (data) {
        $.each(data, function(index, value){
            servicesArray.push(value);
        })
    });

    console.log(servicesArray)

    // Array de quotes vacíos

    let quoteList = [];


    if (localStorage.getItem('quotes')) {
        quoteList = JSON.parse(localStorage.getItem('quotes'));
    }

    // Función que guarda Quotes en el storage

    function saveQuoteToStorage(key, quote){
        quoteList.push(quote);
        localStorage.setItem(key, JSON.stringify(quoteList));
    }


    // Función que recupera Quotes del storage

    function getQuoteFromStorage(key){
        if (localStorage.getItem(key)){
            return JSON.parse(localStorage.getItem(key));
        }
        
    }    

    //Función que crea la card con cotización
    
    function createCard(element, id){
        const card = `
        <div id=${id} class="card">
            <div class="card-body">
                <div class="card-title"></div>
                <div class="card-details"></div>
            </div>
        </div>
        `
        $(element).html(card);
    };

    //Función que crea el título personalizado para la card

    function createCardTitle(data, element){
        const title = `<h4 class="card-title">Cotización para <span>${data}<span></h4>`;
        $(element).append(title);
    };

    //Función que crea la sección de cotización

    function createDetailsSection(element, clase){
        const quoteDetails = `<div class=${clase}><ul></ul></div>`;
        $(element).append(quoteDetails);
    }

    //Funciones que crean los headings

    function createDetails(date, clientType, currency, service, total, element){
        date = `<li><strong>Fecha de cotización:</strong> ${date}</li>`;
        clientType = `<li><strong>Tipo de cliente:</strong> ${clientType}</li>`;
        currency = `<li><strong>Moneda de cotización:</strong> ${currency}</li>`;
        service = `<li><strong>Servicio solicitado:</strong> ${service}</li>`;
        total = `<li><span class="total-budget">Presupuesto total:</span> ${total}</li>`;
        $(element).append(date, clientType, currency, service, total);
    }

    //Función que calcula el presupuesto

    function estimateBudget(userInput){
        userInput = inputSiteType;

        servicesArray.forEach(function(e){
            if (userInput == e.service_description){
                return(e.service_price);
            }
        });

        
        //let budget = addFeePM(input.service_price * "Fee de Project Management.service_price");
        //return budget;
    };
    
    //Función para calcular el fee de project management
    function addFeePM(price, fee){
        const subtotal = price + (price * fee);
        return subtotal;
    }

    //Click en Cotizar

    $(form).submit(function (event) { 
        event.preventDefault();

        const accountName = inputAccount.val();
        const date = inputDate.val();
        const clientType = inputClientType.val();
        const currency = inputCurrency.val();
        const siteType = inputSiteType.val();
        const budget = estimateBudget();

        const quote = new Quote(accountName, date, clientType, currency, siteType, budget);
        
        // Verifica los campos
        
        if ($.trim($("#form__accountName").val()) === "" || $.trim($("#form__date").val()) === "" || $.trim($("#form__clientType").val()) === "" || $.trim($("#form__currency").val()) === "" || $.trim($("#form__siteType").val()) === "") {
            alert('No olvides completar todos los campos del formulario.');
            return false;
        }

        saveQuoteToStorage('quotes', quote);
        createCard('.quoteArea', 'quoteID');
        createCardTitle(accountName, '.card-title')
        createDetailsSection('.card-details', 'cardDetails')
        createDetails(date, clientType, currency, siteType, budget, '.card-details')

        
    });





});