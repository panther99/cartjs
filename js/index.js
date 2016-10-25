var format = document.getElementById("format");
var kolicina = document.getElementById("kolicina");
var naruci = document.getElementById("naruci");
var obrisi = document.getElementsByClassName("obrisi");

// prikazivanje narudžbina na stranici ukoliko već postoje u local storage
document.addEventListener("DOMContentLoaded", function () {

    if (localStorage.getItem("cart")) {

        var cart = JSON.parse(localStorage.getItem("cart"));
        var items = Object.keys(cart);
        var len = items.length;

        for (var i = 1; i < len; i++) {

            var format_slike = cart[items[i]].split(",")[0];
            var broj_slika = cart[items[i]].split(",")[1];
            var id = items[i].substring(6, items[i].length-1);

            // kreiramo novu stavku na stranici
            $(".container").append("<div class='row" + id + "'><div class='col-md-12 text-center'><div class='thumbnail'><p>Format: " + format_slike + "</p><p>Količina: " + broj_slika + "</p><button class='btn btn-danger delete" + id + " obrisi'><span class='glyphicon glyphicon-trash'></span>&nbsp;Ukloni</button></div></div></div>");

            // dodajemo event listener dugmadima za uklanjanje
            addListener();

            // provera
            check();

        }

    }

});

// postavljamo event listener na dugme za svaki klik
naruci.addEventListener("click", function () {
    if (!localStorage.getItem("cart")) {
        if (parseInt(kolicina.value) <= 0) {
            alert("Morate uneti količinu!");
        } else {
            createCart();
        }
    } else {
        if (parseInt(kolicina.value) <= 0) {
            alert("Morate uneti količinu!");
        } else {
            addToCart();
        }
    }
});

// kreiranje prve narudžbine
function createCart() {

    // kreiramo novi objekat korpe
    var cart = {
        numberOfItems: 0
    };

    // kreiramo ime za novi objekat koji će biti poslan u localStorage
    // item<id>
    var name = "item" + cart.numberOfItems;

    // kreiramo novi objekat u korpi
    // item<id> = "<format>,<kolicina>"
    cart[name] = format.value + "," + kolicina.value;

    // povećavamo brojevno stanje stavki u korpi
    cart["numberOfItems"] = parseInt(cart.numberOfItems+1);

    // prebacujemo objekat u JSON i skladištimo u local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // dodavanje stavke na stranicu
    addItemOnPage();

    // provera
    check();

} 


// dodavanje narudžbine
function addToCart() {
    
    // prebacujemo string iz korpe u JS objekat
    var cart = JSON.parse(localStorage.getItem("cart"));

    // definišemo ime za novu stavku prema dostupnom parametru brojevnog stanja u korpi
    var name = "item" + parseInt(cart["numberOfItems"]);

    // kreiramo novi objekat u korpi
    cart[name] = format.value + "," + kolicina.value;

    // povećavamo brojevno stanje stavki u korpi
    cart["numberOfItems"] = parseInt(cart.numberOfItems+1);

    // prebacujemo objekat u JSON i skladištimo u local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // dodavanje stavke na stranicu
    addItemOnPage();

    // provera
    check();

}

// dodavanje stavke na stranicu
function addItemOnPage() {

    var cart = JSON.parse(localStorage.getItem("cart"));
    var id = cart.numberOfItems-1;
    var item = cart["item"+id]; 

    // koristimo informacije za kreiranje nove stavke na stranici
    var format_slike = item.split(",")[0];
    var broj_slika = item.split(",")[1];

    // kreiramo novu stavku na stranici
    $(".container").append("<div class='row" + id + "'><div class='col-md-12 text-center'><div class='thumbnail'><p>Format: " + format_slike + "</p><p>Količina: " + broj_slika + "</p><button class='btn btn-danger delete" + id + " obrisi'><span class='glyphicon glyphicon-trash'></span>&nbsp;Ukloni</button></div></div></div>");

    // postavljamo event listener dugmetu za brisanje u svakoj stavci
    addListener();

}

// provera
function check() {

    var cart = JSON.parse(localStorage.getItem("cart"));
    console.log(cart);

}

// dodavanje event listener-a dugmetu za brisanje u svakoj stavci
function addListener() {

    var e = obrisi.length-1;
    obrisi[e].addEventListener("click", function () {
        var stavka = $(this).prop("classList")[2];
        var id = stavka.substring(6, stavka.length);
        removeItem(id);
    });

}

// uklanjanje stavke
function removeItem(id) {

    /*
        Broj stavki u korpi (numberOfItems) ne smanjujemo iz razloga
        što bi u suprotnom dolazilo do poklapanja dve stavke.

        Svaka stavka ima svoj jedinstveni ID pre kreaciji (item<id>)
        koji se više ne može koristiti za drugu stavku u toku postojanja
        cart objekta u LocalStorage-u.
    */

    // uklanjamo element sa stranice
    $(".row" + id).fadeOut("slow").remove();

    var cart = JSON.parse(localStorage.getItem("cart"));
    
    // uklanjamo stavku iz korpe
    delete cart["item"+id];

    localStorage.setItem("cart", JSON.stringify(cart));

    // provera
    check();

}