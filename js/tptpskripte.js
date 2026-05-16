"use strict";

const body = document.body;

const darkModeBtn = document.getElementById("dark-mode-toggle");

const filterButtons = document.querySelectorAll(".filter-btn");
const kartice = document.querySelectorAll(".kartica");

const brojPrikazanih = document.getElementById("broj");
const nemaRezultata = document.getElementById("nema-rezultata");

const kontaktDugme = document.getElementById("btn-posalji");
const resetDugme = document.getElementById("btn-reset");

const uspjesnaPoruka = document.getElementById("uspjesna-poruka");
const uspjesnaTekst = document.getElementById("uspjesna-tekst");

const porukaPolje = document.getElementById("poruka");
const brojacPoruke = document.getElementById("poruka-brojac");


/* =========================================================
   DARK MODE
   ========================================================= */

function inicijalizujTemu() {

    const sacuvanaTema = localStorage.getItem("soundarchive-tema");

    if (sacuvanaTema === "dark") {
        body.classList.add("dark-mode");
    }
}

function promijeniTemu() {

    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("soundarchive-tema", "dark");
    } else {
        localStorage.setItem("soundarchive-tema", "light");
    }
}

if (darkModeBtn) {

    inicijalizujTemu();

    darkModeBtn.addEventListener("click", promijeniTemu);
}


/* =========================================================
   FILTRIRANJE KARTICA
   ========================================================= */

function filtrirajKartice(kategorija) {

    let brojVidljivih = 0;

    kartice.forEach((kartica) => {

        const kategorijaKartice = kartica.dataset.kategorija;

        if (
            kategorija === "sve" ||
            kategorijaKartice === kategorija
        ) {

            kartica.style.display = "flex";

            setTimeout(() => {
                kartica.classList.add("prikazana");
            }, 100);

            brojVidljivih++;

        } else {

            kartica.style.display = "none";
            kartica.classList.remove("prikazana");
        }

    });

    if (brojPrikazanih) {
        brojPrikazanih.textContent = brojVidljivih;
    }

    if (nemaRezultata) {

        if (brojVidljivih === 0) {
            nemaRezultata.style.display = "block";
        } else {
            nemaRezultata.style.display = "none";
        }
    }
}

filterButtons.forEach((dugme) => {

    dugme.addEventListener("click", () => {

        filterButtons.forEach((btn) => {
            btn.classList.remove("aktivan-filter");
        });

        dugme.classList.add("aktivan-filter");

        const filter = dugme.dataset.filter;

        filtrirajKartice(filter);
    });
});


/* =========================================================
   ANIMIRANI BROJAČI
   ========================================================= */

function animirajBrojac(elementId, krajnjaVrijednost, brzina = 40) {

    const element = document.getElementById(elementId);

    if (!element) return;

    let trenutnaVrijednost = 0;

    const interval = setInterval(() => {

        trenutnaVrijednost++;

        element.textContent = trenutnaVrijednost;

        if (trenutnaVrijednost >= krajnjaVrijednost) {
            clearInterval(interval);
        }

    }, brzina);
}

window.addEventListener("load", () => {

    animirajBrojac("bendova-broj", 6, 120);
    animirajBrojac("albuma-broj", 47, 40);
});


/* =========================================================
   VALIDACIJA FORME
   ========================================================= */

function prikaziGresku(id, poruka) {

    const greska = document.getElementById(id);

    if (greska) {
        greska.textContent = poruka;
    }
}

function obrisiGreske() {

    const greske = document.querySelectorAll(".greska-poruka");

    greske.forEach((greska) => {
        greska.textContent = "";
    });
}

function validirajEmail(email) {

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
}

function validirajFormu() {

    obrisiGreske();

    let formaIspravna = true;

    const ime = document.getElementById("ime");
    const prezime = document.getElementById("prezime");
    const email = document.getElementById("email");
    const bend = document.getElementById("predlozeni-bend");
    const tema = document.getElementById("tema");
    const poruka = document.getElementById("poruka");
    const saglasnost = document.getElementById("saglasnost");

    if (ime && ime.value.trim().length < 2) {

        prikaziGresku(
            "ime-greska",
            "Unesite ispravno ime."
        );

        formaIspravna = false;
    }

    if (prezime && prezime.value.trim().length < 2) {

        prikaziGresku(
            "prezime-greska",
            "Unesite ispravno prezime."
        );

        formaIspravna = false;
    }

    if (email && !validirajEmail(email.value.trim())) {

        prikaziGresku(
            "email-greska",
            "Unesite validnu email adresu."
        );

        formaIspravna = false;
    }

    if (bend && bend.value.trim().length < 2) {

        prikaziGresku(
            "bend-greska",
            "Unesite naziv benda."
        );

        formaIspravna = false;
    }

    if (tema && tema.value === "") {

        prikaziGresku(
            "tema-greska",
            "Odaberite temu."
        );

        formaIspravna = false;
    }

    const radioOpcije =
        document.querySelectorAll('input[name="izvor"]');

    let radioOdabran = false;

    radioOpcije.forEach((radio) => {

        if (radio.checked) {
            radioOdabran = true;
        }
    });

    if (!radioOdabran) {

        prikaziGresku(
            "izvor-greska",
            "Odaberite jednu opciju."
        );

        formaIspravna = false;
    }

    if (poruka && poruka.value.trim().length < 20) {

        prikaziGresku(
            "poruka-greska",
            "Poruka mora imati najmanje 20 znakova."
        );

        formaIspravna = false;
    }

    if (saglasnost && !saglasnost.checked) {

        prikaziGresku(
            "saglasnost-greska",
            "Morate prihvatiti saglasnost."
        );

        formaIspravna = false;
    }

    return formaIspravna;
}


/* =========================================================
   SLANJE FORME
   ========================================================= */

if (kontaktDugme) {

    kontaktDugme.addEventListener("click", () => {

        const validnaForma = validirajFormu();

        if (validnaForma) {

            uspjesnaPoruka.style.display = "flex";

            uspjesnaTekst.textContent =
                "Vaša poruka je uspješno poslana. Hvala što doprinosite SoundArchive projektu!";

            uspjesnaPoruka.style.opacity = "0";

            setTimeout(() => {
                uspjesnaPoruka.style.opacity = "1";
            }, 100);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            sacuvajFormuULocalStorage();

        } else {

            uspjesnaPoruka.style.display = "none";
        }
    });
}


/* =========================================================
   RESET FORME
   ========================================================= */

if (resetDugme) {

    resetDugme.addEventListener("click", () => {

        const potvrda = confirm(
            "Da li ste sigurni da želite obrisati unos?"
        );

        if (!potvrda) return;

        const inputs =
            document.querySelectorAll(
                "input, textarea, select"
            );

        inputs.forEach((input) => {

            if (
                input.type === "checkbox" ||
                input.type === "radio"
            ) {

                input.checked = false;

            } else {

                input.value = "";
            }
        });

        obrisiGreske();

        if (uspjesnaPoruka) {
            uspjesnaPoruka.style.display = "none";
        }

        if (brojacPoruke) {

            brojacPoruke.textContent =
                "0 / 20 znakova minimalno";

            brojacPoruke.classList.remove("validno");
        }
    });
}


/* =========================================================
   BROJAČ KARAKTERA
   ========================================================= */

if (porukaPolje && brojacPoruke) {

    porukaPolje.addEventListener("input", () => {

        const brojKaraktera =
            porukaPolje.value.length;

        brojacPoruke.textContent =
            `${brojKaraktera} / 20 znakova minimalno`;

        if (brojKaraktera >= 20) {

            brojacPoruke.classList.add("validno");

        } else {

            brojacPoruke.classList.remove("validno");
        }
    });
}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function sacuvajFormuULocalStorage() {

    const podaci = {

        ime:
            document.getElementById("ime")?.value || "",

        prezime:
            document.getElementById("prezime")?.value || "",

        email:
            document.getElementById("email")?.value || "",

        bend:
            document.getElementById("predlozeni-bend")?.value || "",

        tema:
            document.getElementById("tema")?.value || "",

        poruka:
            document.getElementById("poruka")?.value || ""
    };

    localStorage.setItem(
        "soundarchive-kontakt-forma",
        JSON.stringify(podaci)
    );
}


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

const anchorLinkovi =
    document.querySelectorAll('a[href^="#"]');

anchorLinkovi.forEach((link) => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        const id = this.getAttribute("href");

        const sekcija = document.querySelector(id);

        if (sekcija) {

            sekcija.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});


/* =========================================================
   INTERSECTION OBSERVER ANIMACIJE
   ========================================================= */

const elementiZaAnimaciju = document.querySelectorAll(
    ".kartica, .bend-sekcija, .autor-kartica, .aside-blok, .kontakt-forma-sekcija, .kontakt-info"
);

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {
    threshold: 0.15
});

elementiZaAnimaciju.forEach((element) => {

    element.classList.add("hidden-element");

    observer.observe(element);

});


/* =========================================================
   AKTIVNI BOOKMARK LINKOVI
   ========================================================= */

const sekcije = document.querySelectorAll("section[id]");

const bookmarkLinkovi =
    document.querySelectorAll(".bookmark-nav a");

window.addEventListener("scroll", () => {

    let trenutnaSekcija = "";

    sekcije.forEach((sekcija) => {

        const sekcijaTop =
            sekcija.offsetTop - 200;

        if (window.scrollY >= sekcijaTop) {

            trenutnaSekcija =
                sekcija.getAttribute("id");
        }
    });

    bookmarkLinkovi.forEach((link) => {

        link.classList.remove("bookmark-aktivan");

        if (
            link.getAttribute("href") ===
            `#${trenutnaSekcija}`
        ) {

            link.classList.add("bookmark-aktivan");
        }
    });
});


/* =========================================================
   SCROLL TO TOP DUGMAD
   ========================================================= */

const skokDugmad =
    document.querySelectorAll(".skok-na-vrh");

skokDugmad.forEach((dugme) => {

    dugme.addEventListener("click", (event) => {

        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});
