# Čtenářův deník

Semestrální práce pro předmět Architektura cloudových aplikací.

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/fpTkAYoz)

## Autor
Ondřej Sabrňák

## Popis projektu
Aplikace slouží jako elektronický čtenářský deník. Uživatelé mohou:
- Spravovat seznam knih
- Zaznamenávat pokrok ve čtení
- Přidávat poznámky k jednotlivým čtenářským záznamům

## Technologie
- Backend: Node.js, Express.js
- Ukládání dat: JSON soubory
- Validace: AJV
- CORS pro komunikaci s frontend aplikací

## Struktura projektu
```
├── server/              # Backend aplikace
│   ├── abl/            # Application Business Logic
│   ├── controllers/    # Express kontrolery
│   ├── dao/           # Data Access Objects
│   ├── services/      # Sdílené služby
│   └── app.js         # Hlavní soubor aplikace
└── README.md          # Dokumentace projektu
```

## Instalace a spuštění
```bash
# Přejít do složky serveru
cd server

# Instalace závislostí
npm install

# Spuštění serveru v produkčním módu
npm start

# Spuštění serveru ve vývojovém módu (automatický restart při změnách)
npm run dev
```

## API Dokumentace

### Knihy
- `POST /book/list` - Seznam všech knih
- `POST /book/get` - Detail knihy (body: `{ "id": "..." }`)
- `POST /book/create` - Vytvoření nové knihy (body: data knihy)
- `POST /book/update` - Úprava knihy (body: data knihy včetně ID)
- `POST /book/delete` - Smazání knihy (body: `{ "id": "..." }`)

### Čtenářské záznamy
- `POST /readingRecord/list` - Seznam záznamů
- `POST /readingRecord/get` - Detail záznamu (body: `{ "id": "..." }`)
- `POST /readingRecord/create` - Vytvoření záznamu (body: data záznamu)
- `POST /readingRecord/update` - Úprava záznamu (body: data záznamu včetně ID)
- `POST /readingRecord/delete` - Smazání záznamu (body: `{ "id": "..." }`)

### Příklady požadavků

#### Získání detailu knihy
```json
POST /book/get
{
    "id": "78ca114886e227dd06cf4f6838d2a5e4"
}
```

#### Vytvoření nové knihy
```json
POST /book/create
{
    "title": "1984",
    "author": "George Orwell",
    "numberOfPages": 328,
    "isbn": "978-0451524935"
}
```

#### Vytvoření čtenářského záznamu
```json
POST /readingRecord/create
{
    "bookId": "78ca114886e227dd06cf4f6838d2a5e4",
    "readPages": 50,
    "date": "2024-01-14",
    "note": "Zajímavá první kapitola"
}
```

## Funkce
- Správa knih (CRUD operace)
- Sledování čtenářského pokroku
- Validace vstupních dat
- Atomické operace s rollback podporou
- Standardizované chybové odpovědi
