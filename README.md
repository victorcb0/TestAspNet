# TestAspNet

# IBAN Admin App

Aplicație de administrare și gestionare coduri IBAN, cu sistem de autentificare și roluri.

## 🔐 Autentificare

Pagina de login permite autentificarea utilizatorilor în funcție de rol (`Admin`, `Operator`, `OperatorRaion`).

![Autentificare](https://github.com/victorcb0/TestAspNet/blob/main/Images/1.Auth.png)

---

## 👤 Administrare Utilizatori

Administratorul poate crea utilizatori noi și le poate aloca roluri, inclusiv asignarea unui raion pentru `OperatorRaion`.

![Admin](https://github.com/victorcb0/TestAspNet/blob/main/Images/2.Admin.png)

---

## 📋 Gestionare IBAN-uri

Utilizatorii cu rolul `Admin` și `Operator` pot:
- adăuga coduri IBAN
- edita
- șterge
- filtra după: raion, localitate, cod eco, an

![Formular IBAN](https://github.com/victorcb0/TestAspNet/blob/main/Images/3.Iban1.png)

---

## 🔍 Filtrare, sortare și paginare

Codurile IBAN pot fi:
- filtrate după mai mulți parametri
- sortate asc/desc
- paginate (10 pe pagină)

![Tabel IBAN](https://github.com/victorcb0/TestAspNet/blob/main/Images/4.Iban2.png)

---

## 📥 Export CSV

Tabelul complet poate fi exportat într-un fișier `.csv`.

![Export CSV](https://github.com/victorcb0/TestAspNet/blob/main/Images//5.CSV.png)

---
