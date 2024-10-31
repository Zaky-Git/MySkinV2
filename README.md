# MySkin V2

MySkin adalah sistem deteksi kanker kulit melanoma menggunakan Convolutional Neural Networks (CNN) melalui platform web berbasis Laravel 11 dan ReactJS. Sistem ini bertujuan memberikan layanan deteksi melanoma kepada pengguna secara mudah dan cepat.

## Project Requirements

### Prerequisites

Pastikan Anda sudah menginstal software berikut sebelum memulai proyek:
- **Node.js**: Versi 14 atau lebih tinggi.
- **Composer**: Versi 2.5.8 atau lebih tinggi.
- **PHP**:  Versi 8.2 atau lebih tinggi.
- **Python **: Versi 3.6 atau lebih tinggi
- **Database**: MySQL.

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone <repository_url>
   cd MySkinV2
   ```

2. **Backend Setup (Laravel)**

   a. **Install Composer Dependencies**
   ```bash
   composer install
   ```

   b. **Konfigurasi Environment**
   - Salin file `.env.example` ke `.env`
   - Setting database dan informasi lain di file `.env` sesuai kebutuhan

   c. **Database Migration**
   ```bash
   php artisan migrate
   ```

   d. **Menjalankan Server Lokal**
   ```bash
   php artisan serve
   ```

3. **Frontend Setup (React)**
   
   a. **Masuk ke folder frontend**
   ```bash
   cd react
   ```

   b. **Install Dependencies**
   ```bash
   npm install
   ```

   c. **Menjalankan Server Development**
   ```bash
   npm run dev
   ```

### Testing Requirements

- **Frontend Testing (React)**: Menggunakan **Jest**
- **Backend Testing (Laravel)**: Menggunakan **PHPUnit**

### Continuous Integration (CI) Setup

Agar perubahan terbaru diuji dan divalidasi secara otomatis, proyek ini menggunakan **GitHub Actions** sebagai CI. CI ini mengelola:
- **Build dan testing otomatis** di branch `main`, `dev`, dan branch anggota tim.
- **Run Laravel Tests** dengan `PHPUnit`.
- **Run React Tests** dengan `Jest`.
