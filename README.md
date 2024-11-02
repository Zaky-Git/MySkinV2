Berikut adalah versi yang sudah dirapikan:

---

# MySkin V2

MySkin adalah sistem deteksi kanker kulit melanoma menggunakan Convolutional Neural Networks (CNN) melalui platform web berbasis Laravel 11 dan ReactJS. Sistem ini bertujuan memberikan layanan deteksi melanoma kepada pengguna secara mudah dan cepat.

## Project Requirements

### Prerequisites

Pastikan Anda sudah menginstal software berikut sebelum memulai proyek:
- **Node.js**: Versi 14 atau lebih tinggi.
- **Composer**: Versi 2.5.8 atau lebih tinggi.
- **PHP**: Versi 8.2 atau lebih tinggi.
- **Python**: Versi 3.6 atau lebih tinggi.
- **Database**: MySQL.

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/Zaky-Git/MySkinV2.git
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

   d. **Database Seeding**
   ```bash
   php artisan db:seed
   ```

   e. **Menjalankan Server Laravel**
   ```bash
   php artisan serve
   ```

   f. **(Optional) Jika Mengalami Error CORS atau API Tidak Dapat Diakses**
   
      Jalankan perintah berikut untuk membersihkan dan memperbarui cache konfigurasi:

      ```bash
      php artisan config:clear
      php artisan config:cache
      ```

      Perintah `config:clear` akan menghapus cache konfigurasi, sedangkan `config:cache` akan membuat cache konfigurasi baru. Ini memastikan bahwa perubahan pada file `.env` dan konfigurasi lainnya diterapkan dengan benar.

      Setelah itu, lanjutkan menjalankan server Laravel:

      ```bash
      php artisan serve
      ```

      Perintah tambahan ini membantu menghindari konflik konfigurasi yang mungkin muncul akibat perubahan pada file `.env` atau file konfigurasi lain di Laravel.

3. **Frontend Setup (React)**
   
   a. **Masuk ke Folder Frontend**
   ```bash
   cd react
   ```

   b. **Konfigurasi Environment**
   - Salin file `.env.example` ke `.env`
   - Setting vite_base_api_url di file `.env` sesuai url backend

   c. **Install Dependencies**
   ```bash
   npm install
   ```

   d. **Menjalankan Server React**
   ```bash
   npm run dev
   ```

4. **AI Setup (Flask)**
   
   a. **Masuk ke Folder Flask**
   ```bash
   cd flask
   ```

   b. **Install Dependencies**
   ```bash
   pip install Flask tensorflow pillow   
   ```

   c. **Menjalankan Server Flask**
   ```bash
   python app.py
   ```

### Testing Requirements

- **Frontend Testing (React)**: Menggunakan **Jest**
- **Backend Testing (Laravel)**: Menggunakan **PHPUnit**

### Continuous Integration (CI) Setup

Agar perubahan terbaru diuji dan divalidasi secara otomatis, proyek ini menggunakan **GitHub Actions** sebagai CI. CI ini mengelola:
- **Build dan testing otomatis** di branch `main`, `dev`, dan branch anggota tim.
- **Run Laravel Tests** dengan `PHPUnit`.
- **Run React Tests** dengan `Jest`.
