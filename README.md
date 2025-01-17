# wdai-project

## Opis projektu

**wdai-project** to aplikacja webowa zbudowana w oparciu o technologie frontendowe i backendowe, umożliwiająca użytkownikom przeglądanie produktów, dodawanie recenzji oraz korzystanie z prostego systemu zarządzania użytkownikami. Projekt został zaprojektowany z myślą o modularności i skalowalności, wykorzystując nowoczesne biblioteki i frameworki.

---

## Funkcje projektu

- **Zarządzanie użytkownikami**: 
  - Rejestracja i logowanie użytkowników.
  - Bezpieczne przechowywanie haseł z wykorzystaniem `bcrypt`.

- **Recenzje produktów**: 
  - Dodawanie, edytowanie i wyświetlanie recenzji.
  - System ocen (1-5 gwiazdek).
  - Powiązanie recenzji z użytkownikami i produktami.

- **Lista produktów**: 
  - Przeglądanie produktów dostępnych w bazie danych.
  - Integracja recenzji z listą produktów.

- **Responsywny design**: 
  - Wykorzystanie `Bootstrap` i `TailwindCSS` dla stylizacji oraz dostosowania do urządzeń mobilnych.

- **API REST**: 
  - Endpoints do zarządzania użytkownikami, recenzjami i produktami.
  - Obsługa CORS i walidacja danych.

---

## Setup projektu

### Wymagania wstępne

- Node.js (v16+)
- SQLite (do lokalnej bazy danych)

### Instalacja

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/username/wdai-project.git
   cd wdai-project
   ```
2. Zainstaluj zależności:
  ```bash
  npm install
  ```
3. Skonfiguruj plik .env:
  utwórz plik .env w głównym katalogu projektu
  dodaj do niego te zmienne środowiskowe:
  ```makefile
  JWT_SECRET=your_secret_key
  DATABASE_URL=sqlite:./database.sqlite
  ```
4. Zainicjalizuj bazę danych
```bash
node server.js
```
5. Uruchom aplikację w trybie developerskim:

```bash
npm run dev
```
6. Otwórz aplikację w przeglądarce pod adresem: http://localhost:3000

---

## Technologie

### Frontend
- React – do budowy interfejsu użytkownika.
- React Router – zarządzanie trasami w aplikacji.
- Bootstrap i TailwindCSS – stylizacja i responsywny design

### Backend
- Express – serwer HTTP.
- Sequelize – ORM do zarządzania bazą danych.
- JWT – obsługa autoryzacji użytkowników.
- bcrypt – hashowanie haseł.

### Baza Danych
- SQLite – baza danych lokalna do przechowywania użytkowników, produktów i recenzji.

### Narzędzia developerskie
- TypeScript – statyczne typowanie.
- Vite – szybki bundler dla aplikacji React.
- ESLint – linter dla czystego kodu.
- PostCSS – przetwarzanie CSS

---

## Biblioteki użyte w projekcie

### Główne zależności:
- axios – obsługa zapytań HTTP.
- bcrypt – hashowanie haseł.
- body-parser – obsługa żądań POST.
- cors – obsługa żądań CORS.
- dotenv – zarządzanie zmiennymi środowiskowymi.
- express – backendowy framework.
- jsonwebtoken – generowanie i weryfikacja tokenów JWT.
- sequelize – ORM dla bazy danych.
- sqlite3 – baza danych.

### Zależności developerskie:
- typescript – typowanie statyczne.
- eslint – linter do wykrywania problemów w kodzie.
- vite – bundler i dev server.
- tailwindcss – utility-first framework CSS.



