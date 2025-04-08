// Event type definitions
export interface EventType {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  featured: boolean;
  registrationLink?: string;
  category: string;
}

export interface DetailedEventType extends EventType {
  // Additional fields for detailed event information
  organizer: string;
  speakers: SpeakerType[];
  agenda: AgendaItemType[];
  prerequisites?: string[];
  maxParticipants: number;
  currentParticipants: number;
  registrationDeadline: string;
  price: number | 'Gratis';
  benefits: string[];
  contactPerson: ContactPersonType;
  faqs: FAQType[];
  images?: string[];
}

export interface SpeakerType {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export interface AgendaItemType {
  time: string;
  title: string;
  description?: string;
}

export interface ContactPersonType {
  name: string;
  phone: string;
  email: string;
  whatsapp?: string;
}

export interface FAQType {
  question: string;
  answer: string;
}

// Sample event data
export const events: EventType[] = [
  {
    id: "ev1",
    title: "Workshop UI/UX Design for Beginner",
    date: "2023-12-15T10:00:00",
    time: "10:00 - 14:00",
    location: "Auditorium Kampus A",
    description: "Workshop interaktif yang membahas dasar-dasar UI/UX design dan implementasinya dalam pengembangan aplikasi modern.",
    featured: true,
    registrationLink: "/events/ev1",
    category: "Workshop",
  },
  {
    id: "ev2",
    title: "Seminar Teknologi Blockchain",
    date: "2023-12-20T13:00:00",
    time: "13:00 - 16:00",
    location: "Aula Utama",
    description: "Seminar yang membahas teknologi blockchain, cryptocurrency, dan implementasinya dalam berbagai industri.",
    featured: true,
    registrationLink: "/events/ev2",
    category: "Seminar",
  },
  {
    id: "ev3",
    title: "Kompetisi Pemrograman Tahunan",
    date: "2024-01-10T08:00:00",
    time: "08:00 - 17:00",
    location: "Lab Komputer Gedung B",
    description: "Kompetisi pemrograman tahunan untuk mahasiswa informatika dengan hadiah menarik dan sertifikat.",
    featured: false,
    registrationLink: "/events/ev3",
    category: "Kompetisi",
  },
  {
    id: "ev4",
    title: "Webinar: Karir di Bidang Data Science",
    date: "2024-01-15T15:00:00",
    time: "15:00 - 17:00",
    location: "Online via Zoom",
    description: "Webinar yang membahas peluang karir di bidang data science dan skill yang dibutuhkan untuk sukses.",
    featured: true,
    registrationLink: "/events/ev4",
    category: "Webinar",
  },
  {
    id: "ev5",
    title: "Workshop: Mobile App Development with Flutter",
    date: "2024-01-25T09:00:00",
    time: "09:00 - 15:00",
    location: "Ruang Seminar Gedung C",
    description: "Workshop pengembangan aplikasi mobile menggunakan framework Flutter dengan hands-on project.",
    featured: false,
    registrationLink: "/events/ev5",
    category: "Workshop",
  },
  {
    id: "ev6",
    title: "Diskusi Panel: Etika dalam Kecerdasan Buatan",
    date: "2024-02-05T13:00:00",
    time: "13:00 - 15:30",
    location: "Auditorium Kampus B",
    description: "Diskusi panel yang membahas isu-isu etika dalam pengembangan dan implementasi teknologi kecerdasan buatan.",
    featured: false,
    registrationLink: "/events/ev6",
    category: "Diskusi",
  }
];

// Detailed event data
export const detailedEvents: Record<string, DetailedEventType> = {
  "ev1": {
    id: "ev1",
    title: "Workshop UI/UX Design for Beginner",
    date: "2023-12-15T10:00:00",
    time: "10:00 - 14:00",
    location: "Auditorium Kampus A",
    description: "Workshop interaktif yang membahas dasar-dasar UI/UX design dan implementasinya dalam pengembangan aplikasi modern. Peserta akan belajar prinsip-prinsip desain, user research, wireframing, prototyping, dan pengujian usability.",
    featured: true,
    registrationLink: "/events/ev1",
    category: "Workshop",
    organizer: "HMTI Pemuda",
    speakers: [
      {
        name: "Dian Pratama",
        role: "Senior UI/UX Designer at TechCorp",
        bio: "Dian adalah seorang desainer UI/UX berpengalaman dengan lebih dari 5 tahun pengalaman di industri teknologi. Ia telah menangani berbagai proyek dari aplikasi mobile hingga platform enterprise.",
        image: "/images/speakers/dian-pratama.jpg"
      },
      {
        name: "Reza Firmansyah",
        role: "Product Designer at StartupX",
        bio: "Reza memiliki latar belakang dalam desain grafis dan beralih ke UI/UX design 3 tahun lalu. Ia berfokus pada desain yang berpusat pada pengguna dan memiliki keahlian dalam riset pengguna.",
        image: "/images/speakers/reza-firmansyah.jpg"
      }
    ],
    agenda: [
      {
        time: "10:00 - 10:30",
        title: "Pembukaan dan Perkenalan",
        description: "Pengenalan workshop, pembicara, dan agenda"
      },
      {
        time: "10:30 - 11:30",
        title: "Prinsip Dasar UI/UX Design",
        description: "Memahami perbedaan UI dan UX, prinsip desain, dan psikologi pengguna"
      },
      {
        time: "11:30 - 12:30",
        title: "User Research dan Wireframing",
        description: "Teknik penelitian pengguna dan pembuatan wireframe"
      },
      {
        time: "12:30 - 13:00",
        title: "Istirahat Makan Siang",
      },
      {
        time: "13:00 - 14:00",
        title: "Hands-on Prototyping",
        description: "Praktik langsung membuat prototype menggunakan Figma"
      }
    ],
    prerequisites: [
      "Laptop dengan Figma terinstal",
      "Pemahaman dasar tentang desain grafis (opsional)",
      "Minat dalam desain antarmuka pengguna"
    ],
    maxParticipants: 50,
    currentParticipants: 32,
    registrationDeadline: "2023-12-10T23:59:59",
    price: 75000,
    benefits: [
      "Sertifikat keikutsertaan",
      "Makan siang dan snack",
      "Materi workshop",
      "Networking dengan profesional industri",
      "Kesempatan magang untuk peserta terbaik"
    ],
    contactPerson: {
      name: "Anisa Rahma",
      phone: "+6281234567890",
      email: "anisa@hmtipemuda.org",
      whatsapp: "+6281234567890"
    },
    faqs: [
      {
        question: "Apakah workshop ini cocok untuk pemula?",
        answer: "Ya, workshop ini dirancang khusus untuk pemula yang ingin mempelajari dasar-dasar UI/UX design."
      },
      {
        question: "Apakah saya perlu membawa laptop?",
        answer: "Ya, peserta diharapkan membawa laptop dengan Figma terinstal untuk mengikuti sesi hands-on."
      },
      {
        question: "Apakah ada prasyarat khusus untuk mengikuti workshop ini?",
        answer: "Tidak ada prasyarat khusus, tetapi pemahaman dasar tentang desain grafis akan membantu."
      },
      {
        question: "Bagaimana cara mendapatkan sertifikat?",
        answer: "Sertifikat akan diberikan kepada semua peserta yang menghadiri workshop dari awal hingga akhir."
      }
    ],
    images: [
      "/images/events/workshop-uiux/banner.jpg",
      "/images/events/workshop-uiux/classroom.jpg",
      "/images/events/workshop-uiux/activities.jpg"
    ]
  },
  "ev2": {
    id: "ev2",
    title: "Seminar Teknologi Blockchain",
    date: "2023-12-20T13:00:00",
    time: "13:00 - 16:00",
    location: "Aula Utama",
    description: "Seminar yang membahas teknologi blockchain, cryptocurrency, dan implementasinya dalam berbagai industri. Acara ini akan menghadirkan pakar blockchain yang akan berbagi pengetahuan tentang perkembangan terkini dan masa depan teknologi ini.",
    featured: true,
    registrationLink: "/events/ev2",
    category: "Seminar",
    organizer: "HMTI Pemuda bekerjasama dengan BlockchainID",
    speakers: [
      {
        name: "Dr. Budi Santoso",
        role: "Blockchain Researcher",
        bio: "Dr. Budi adalah peneliti blockchain dengan fokus pada implementasi smart contract dan DeFi. Ia telah menerbitkan berbagai paper ilmiah tentang teknologi blockchain.",
        image: "/images/speakers/budi-santoso.jpg"
      },
      {
        name: "Indra Wijaya",
        role: "CEO CryptoStartup",
        bio: "Indra adalah founder dan CEO CryptoStartup, perusahaan yang fokus pada pengembangan solusi berbasis blockchain untuk sektor keuangan.",
        image: "/images/speakers/indra-wijaya.jpg"
      }
    ],
    agenda: [
      {
        time: "13:00 - 13:15",
        title: "Pembukaan",
      },
      {
        time: "13:15 - 14:00",
        title: "Pengenalan Teknologi Blockchain",
        description: "Konsep dasar, sejarah, dan perkembangan blockchain"
      },
      {
        time: "14:00 - 14:45",
        title: "Implementasi Blockchain di Berbagai Industri",
        description: "Studi kasus penggunaan blockchain di sektor keuangan, supply chain, dan lainnya"
      },
      {
        time: "14:45 - 15:00",
        title: "Coffee Break",
      },
      {
        time: "15:00 - 15:45",
        title: "Masa Depan Blockchain dan Cryptocurrency",
        description: "Tren dan prediksi perkembangan teknologi blockchain"
      },
      {
        time: "15:45 - 16:00",
        title: "Tanya Jawab dan Penutupan",
      }
    ],
    maxParticipants: 200,
    currentParticipants: 145,
    registrationDeadline: "2023-12-18T23:59:59",
    price: "Gratis",
    benefits: [
      "E-sertifikat kehadiran",
      "Materi seminar",
      "Kesempatan networking",
      "Snack dan minuman"
    ],
    contactPerson: {
      name: "Fajar Ramadhan",
      phone: "+6285678901234",
      email: "fajar@hmtipemuda.org",
      whatsapp: "+6285678901234"
    },
    faqs: [
      {
        question: "Apakah seminar ini gratis?",
        answer: "Ya, seminar ini gratis untuk semua peserta yang mendaftar."
      },
      {
        question: "Apakah saya akan mendapatkan sertifikat?",
        answer: "Ya, semua peserta akan mendapatkan e-sertifikat yang akan dikirimkan melalui email."
      },
      {
        question: "Apakah saya perlu memiliki pengetahuan tentang blockchain sebelumnya?",
        answer: "Tidak, seminar ini akan dimulai dari konsep dasar sehingga cocok untuk pemula."
      }
    ],
    images: [
      "/images/events/seminar-blockchain/banner.jpg",
      "/images/events/seminar-blockchain/audience.jpg"
    ]
  },
  // Add more detailed events as needed
};

// Function to get event by ID
export function getEventById(id: string): EventType | undefined {
  return events.find(event => event.id === id);
}

// Function to get detailed event by ID
export function getDetailedEventById(id: string): DetailedEventType | undefined {
  return detailedEvents[id];
}

// Function to get upcoming events
export function getUpcomingEvents(limit?: number): EventType[] {
  const now = new Date();
  const upcoming = events
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return limit ? upcoming.slice(0, limit) : upcoming;
}

// Function to get events by category
export function getEventsByCategory(category: string): EventType[] {
  return category === "all" 
    ? events 
    : events.filter(event => event.category === category);
}
