interface LocationMapProps {
  className?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ className }) => {
  return (
    <section id="lokasi" className="py-10 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-blue-600 mb-8 md:mb-12">Lokasi Kampus</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Maps */}
          <div className="relative w-full h-0 pb-[75%] md:pb-[100%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=Universitas BSI Kampus Pemuda`}>
            </iframe>
          </div>

          {/* Informasi */}
          <div className="space-y-6">
            {/* Informasi Alamat dan Kontak */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Informasi Lokasi</h3>
              <p className="text-gray-600 mb-2">
                Universitas BSI Kampus Pemuda<br />
                Jl. Pemuda No.22, RT.2/RW.7, Rawamangun<br />
                Kec. Pulo Gadung, Jakarta Timur<br />
                DKI Jakarta 13220
              </p>
              <p className="text-gray-600 mb-4">
                Telepon: (021) 4892366
              </p>
              
              {/* Tombol Petunjuk Arah */}
              <a
                href="https://www.google.com/maps/dir//Universitas+BSI+Kampus+Pemuda"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Petunjuk Arah
              </a>
            </div>

            {/* Informasi Transportasi */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Transportasi Umum</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-800">TransJakarta:</h4>
                  <p className="text-gray-600">Halte Pemuda Rawamangun (Koridor 2 dan 2B)</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">KRL Commuter Line:</h4>
                  <p className="text-gray-600">Stasiun Jatinegara (± 3 km)</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Angkutan Umum:</h4>
                  <p className="text-gray-600">Mikrolet M01, M02, M09</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
