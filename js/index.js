var format = document.getElementById("format");
var kolicina = document.getElementById("kolicina");
var naruci = document.getElementById("naruci");
var obrisi = document.getElementsByClassName("obrisi");
var obrisi_sve = document.getElementById("obrisi_sve");

var prices = {
    "1:3": 10,
    "2:5": 20,
    "3:6": 30
}

var options = {
    development: false
}

String.prototype.withoutFirst = function (num) {
    return this.substring(num, this.length);
}

// prikazivanje narudžbina na stranici ukoliko već postoje u local storage
document.addEventListener("DOMContentLoaded", function () {

    if (localStorage.getItem("cart")) {

        var cart = JSON.parse(localStorage.getItem("cart"));
        var items = Object.keys(cart);
        var len = items.length;

        for (var i = 2; i < len; i++) {

            var format_slike = String(cart[items[i]]).split(",")[0];
            var broj_slika = String(cart[items[i]]).split(",")[1];
            var id = items[i].withoutFirst(5);
            var cena = parseInt(prices[format_slike]) * parseInt(broj_slika);

            // kreiramo novu stavku na stranici
            $("#cart").append("<div class='row" + id + "'><div class='col-md-12 text-center'><div class='thumbnail'><p>Format: " + format_slike + "</p><p>Količina: " + broj_slika + "</p><p>Cena: " + cena + "</p><button class='btn btn-danger delete" + id + " obrisi'><span class='glyphicon glyphicon-trash'></span>&nbsp;Ukloni</button></div></div></div>");

            // dodajemo event listener dugmadima za uklanjanje
            addListener();

            // provera
            check();

        }

        updateThePrice(cart["price"]);

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

obrisi_sve.addEventListener("click", function () {

    if (localStorage.getItem("cart")) {

        var cart = JSON.parse(localStorage.getItem("cart"));
        var items = Object.keys(cart);
        var len = items.length;

        for (var i = 2; i < len; i++) {

            var id = items[i].withoutFirst(4);
            $(".row"+id).remove();
            console.log(id);

        }

        // ažuriramo cenu
        updateThePrice(0);

        // uklanjamo objekat korpe iz local storage-a
        localStorage.removeItem("cart");

        // provera
        check();

    }

});

// kreiranje prve narudžbine
function createCart() {

    // kreiramo novi objekat korpe
    var cart = {
        price: 0,
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

    // dodavanje cene
    cart["price"] = parseInt(prices[format.value]) * parseInt(kolicina.value);

    // prebacujemo objekat u JSON i skladištimo u local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // dodajemo element na stranicu
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

    // dodavanje cene
    cart["price"] += parseInt(prices[format.value]) * parseInt(kolicina.value); 

    // prebacujemo objekat u JSON i skladištimo u local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // dodajemo element na stranicu
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
    var cena = parseInt(prices[format_slike]) * parseInt(broj_slika);

    // kreiramo novu stavku na stranici
    $("#cart").append("<div class='row" + id + "'><div class='col-md-12 text-center'><div class='thumbnail'><p>Format: " + format_slike + "</p><p>Količina: " + broj_slika + "</p><p>Cena: " + cena + "</p><button class='btn btn-danger delete" + id + " obrisi'><span class='glyphicon glyphicon-trash'></span>&nbsp;Ukloni</button></div></div></div>");

    // ažuriramo cenu na stranici
    updateThePrice(cart["price"]);

    // postavljamo event listener dugmetu za brisanje u svakoj stavci
    addListener();

}

// provera
function check() {
    
    if (options["development"]) {
        var cart = JSON.parse(localStorage.getItem("cart"));
        console.log(cart);
    }

}

// dodavanje event listener-a dugmetu za brisanje u svakoj stavci
function addListener() {

    var e = obrisi.length-1;
    obrisi[e].addEventListener("click", function () {
        var stavka = $(this).prop("classList")[2];
        var id = stavka.withoutFirst(6);
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
    var item = cart["item"+id];

    // koristimo informacije za smanjivanje cene
    var format_slike = item.split(",")[0];
    var broj_slika = item.split(",")[1];
    var cena = parseInt(prices[format_slike]) * parseInt(broj_slika);
    
    // smanjujemo ukupnu cenu
    cart["price"] -= cena;

    // ažuriramo cenu na stranici
    updateThePrice(cart["price"]);

    // uklanjamo stavku iz korpe
    delete cart["item"+id];

    localStorage.setItem("cart", JSON.stringify(cart));

    // provera
    check();

}

function updateThePrice(price) {
    $(".cena").text(price);
}