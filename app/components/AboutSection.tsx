"use client";

import React from 'react';

const AboutSection = () => {
  return (
    <section className="w-full py-20 bg-white" id="about">
      <div className="container mx-auto px-4">
        {/* Section 2: Tentang HMTI */}
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
            Tentang HMTI
          </h2>
          
          <div className="space-y-6 text-gray-700 text-justify">
            <p className="leading-relaxed">
              Himpunan Mahasiswa Teknologi Informasi (HMTI) adalah wadah aspirasi dan pelayanan 
              bagi mahasiswa Jurusan Teknologi Informasi. HMTI didirikan pada tanggal 02 Februari 
              2020 bertempat di Jakarta. Himpunan Mahasiswa Teknologi Informasi terbentuk dengan 
              dilatar belakangi oleh kebutuhan mahasiswa program studi Teknologi Informasi untuk 
              terciptanya lingkungan yang mendukung pengembangan skill mahasiswa pada program 
              studi tersebut sebagai calon teknisi dan akademisi aktif yang akan turun ke 
              tengah-tengah masyarakat.
            </p>

            <p className="leading-relaxed">
              Terbentuknya HMTI adalah sebagai salah satu wadah organisasi yang sangat dibutuhkan 
              oleh seluruh mahasiswa Teknologi Informasi Universitas Bina Sarana Informatika untuk 
              mencurahkan ide-ide brilian dan mengembangkan kemampuan mereka dalam menguasai 
              materi-materi informatika, dan mengembangkan kreativitas yang tidak hanya bersifat 
              teoritis, sehingga mereka menjadi akademisi yang profesional dan patut diteladani.
            </p>

            <p className="leading-relaxed">
              Memperhatikan realita kemampuan mahasiswa dalam mengelola kepribadian serta 
              kemampuan intelektual dalam sisi akademisi aktif dilingkungan perkuliahan, baik 
              dalam segi teknisi informasi, berkomunikasi atau public speaking dan lain-lain, 
              maka dari itu dengan keinginan luhur dan dukungan dari seluruh mahasiswa Teknologi 
              Informasi Universitas Bina Sarana Informatika memutuskan satu kesepakatan untuk 
              membentuk sebuah organisasi yang bernama HMTI sebagai wadah diskusi mahasiswa 
              Teknologi Informasi dan pengembangan softskill secara produktif.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
