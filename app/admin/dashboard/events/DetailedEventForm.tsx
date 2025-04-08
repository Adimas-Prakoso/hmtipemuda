"use client";

import { useState, useEffect } from "react";
import { DetailedEventType, EventType, SpeakerType, AgendaItemType, FAQType } from "../../../../data/types";

interface DetailedEventFormProps {
  event: EventType;
  onSave: (detailedEvent: DetailedEventType) => void;
  onCancel: () => void;
}

const DetailedEventForm = ({ event, onSave, onCancel }: DetailedEventFormProps) => {
  const [detailedEvent, setDetailedEvent] = useState<DetailedEventType>({
    ...event,
    organizer: "",
    speakers: [],
    agenda: [],
    prerequisites: [],
    maxParticipants: 0,
    currentParticipants: 0,
    registrationDeadline: "",
    price: "Gratis",
    benefits: [],
    contactPerson: {
      name: "",
      phone: "",
      email: "",
      whatsapp: ""
    },
    faqs: [],
    images: []
  });

  const [newSpeaker, setNewSpeaker] = useState<SpeakerType>({
    name: "",
    role: "",
    bio: "",
    image: ""
  });

  const [newAgendaItem, setNewAgendaItem] = useState<AgendaItemType>({
    time: "",
    title: "",
    description: ""
  });

  const [newFAQ, setNewFAQ] = useState<FAQType>({
    question: "",
    answer: ""
  });

  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  useEffect(() => {
    // Load existing detailed event data if available
    const storedEvents = localStorage.getItem("hmtiDetailedEvents");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      if (parsedEvents[event.id]) {
        setDetailedEvent(parsedEvents[event.id]);
      }
    }
  }, [event.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setDetailedEvent((prev: DetailedEventType) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };

  const handleContactPersonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setDetailedEvent((prev: DetailedEventType) => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        [name]: value
      }
    }));
  };

  const handleAddSpeaker = () => {
    if (!newSpeaker.name || !newSpeaker.role) return;
    
    setDetailedEvent((prev: DetailedEventType) => ({
      ...prev,
      speakers: [...prev.speakers, newSpeaker]
    }));
    
    setNewSpeaker({
      name: "",
      role: "",
      bio: "",
      image: ""
    });
  };

  const handleRemoveSpeaker = (index: number) => {
    setDetailedEvent((prev: DetailedEventType) => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index)
    }));
  };

  const handleSpeakerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof SpeakerType) => {
    setNewSpeaker((prev: SpeakerType) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleAddAgendaItem = () => {
    if (!newAgendaItem.time || !newAgendaItem.title) return;
    
    setDetailedEvent((prev: DetailedEventType) => ({
      ...prev,
      agenda: [...prev.agenda, newAgendaItem]
    }));
    
    setNewAgendaItem({
      time: "",
      title: "",
      description: ""
    });
  };

  const handleRemoveAgendaItem = (index: number) => {
    setDetailedEvent((prev: DetailedEventType) => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }));
  };

  const handleAgendaItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof AgendaItemType) => {
    setNewAgendaItem((prev: AgendaItemType) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleAddFAQ = () => {
    if (!newFAQ.question || !newFAQ.answer) return;
    
    setDetailedEvent((prev: DetailedEventType) => ({
      ...prev,
      faqs: [...prev.faqs, newFAQ]
    }));
    
    setNewFAQ({
      question: "",
      answer: ""
    });
  };

  const handleRemoveFAQ = (index: number) => {
    setDetailedEvent((prev: DetailedEventType) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleFAQChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof FAQType) => {
    setNewFAQ((prev: FAQType) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleAddPrerequisite = () => {
    if (!newPrerequisite) return;
    
    setDetailedEvent((prev: DetailedEventType) => ({
      ...prev,
      prerequisites: [...(prev.prerequisites || []), newPrerequisite]
    }));
    
    setNewPrerequisite("");
  };

  const handleRemovePrerequisite = (index: number) => {
    setDetailedEvent((prev: DetailedEventType) => ({
      ...prev,
      prerequisites: prev.prerequisites?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddBenefit = () => {
    if (!newBenefit) return;
    
    setDetailedEvent((prev: DetailedEventType) => ({
      ...prev,
      benefits: [...prev.benefits, newBenefit]
    }));
    
    setNewBenefit("");
  };

  const handleRemoveBenefit = (index: number) => {
    setDetailedEvent((prev: DetailedEventType) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    // Save detailed event
    onSave(detailedEvent);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Detail Event: {event.title}</h2>
      
      {/* Basic Information */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Informasi Dasar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Penyelenggara
            </label>
            <input
              type="text"
              name="organizer"
              value={detailedEvent.organizer}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deadline Pendaftaran
            </label>
            <input
              type="datetime-local"
              name="registrationDeadline"
              value={detailedEvent.registrationDeadline.slice(0, 16)}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jumlah Maksimal Peserta
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={detailedEvent.maxParticipants}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jumlah Peserta Saat Ini
            </label>
            <input
              type="number"
              name="currentParticipants"
              value={detailedEvent.currentParticipants}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Biaya
            </label>
            <input
              type="text"
              name="price"
              value={detailedEvent.price}
              onChange={handleInputChange}
              placeholder="Contoh: 50000 atau 'Gratis'"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Contact Person */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Kontak Person</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama
            </label>
            <input
              type="text"
              name="name"
              value={detailedEvent.contactPerson.name}
              onChange={handleContactPersonChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Telepon
            </label>
            <input
              type="text"
              name="phone"
              value={detailedEvent.contactPerson.phone}
              onChange={handleContactPersonChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={detailedEvent.contactPerson.email}
              onChange={handleContactPersonChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              WhatsApp
            </label>
            <input
              type="text"
              name="whatsapp"
              value={detailedEvent.contactPerson.whatsapp || ""}
              onChange={handleContactPersonChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Speakers */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Pembicara</h3>
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nama
              </label>
              <input
                type="text"
                value={newSpeaker.name}
                onChange={(e) => handleSpeakerChange(e, "name")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Jabatan/Peran
              </label>
              <input
                type="text"
                value={newSpeaker.role}
                onChange={(e) => handleSpeakerChange(e, "role")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                value={newSpeaker.bio}
                onChange={(e) => handleSpeakerChange(e, "bio")}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL Foto (opsional)
              </label>
              <input
                type="text"
                value={newSpeaker.image || ""}
                onChange={(e) => handleSpeakerChange(e, "image")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAddSpeaker}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tambah Pembicara
            </button>
          </div>
        </div>
        
        {/* List of speakers */}
        {detailedEvent.speakers.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Daftar Pembicara</h4>
            <div className="space-y-3">
              {detailedEvent.speakers.map((speaker, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{speaker.name}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{speaker.role}</p>
                      {speaker.bio && <p className="text-sm mt-1">{speaker.bio}</p>}
                    </div>
                    <button
                      onClick={() => handleRemoveSpeaker(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Agenda */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Agenda</h3>
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Waktu
              </label>
              <input
                type="text"
                value={newAgendaItem.time}
                onChange={(e) => handleAgendaItemChange(e, "time")}
                placeholder="Contoh: 09:00 - 10:30"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Judul
              </label>
              <input
                type="text"
                value={newAgendaItem.title}
                onChange={(e) => handleAgendaItemChange(e, "title")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deskripsi (opsional)
              </label>
              <textarea
                value={newAgendaItem.description || ""}
                onChange={(e) => handleAgendaItemChange(e, "description")}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAddAgendaItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tambah Agenda
            </button>
          </div>
        </div>
        
        {/* List of agenda items */}
        {detailedEvent.agenda.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Daftar Agenda</h4>
            <div className="space-y-3">
              {detailedEvent.agenda.map((item, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">{item.time}</span>
                        <h5 className="font-medium">{item.title}</h5>
                      </div>
                      {item.description && <p className="text-sm mt-1">{item.description}</p>}
                    </div>
                    <button
                      onClick={() => handleRemoveAgendaItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* FAQs */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">FAQ</h3>
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pertanyaan
              </label>
              <input
                type="text"
                value={newFAQ.question}
                onChange={(e) => handleFAQChange(e, "question")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Jawaban
              </label>
              <textarea
                value={newFAQ.answer}
                onChange={(e) => handleFAQChange(e, "answer")}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAddFAQ}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tambah FAQ
            </button>
          </div>
        </div>
        
        {/* List of FAQs */}
        {detailedEvent.faqs.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Daftar FAQ</h4>
            <div className="space-y-3">
              {detailedEvent.faqs.map((faq, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{faq.question}</h5>
                      <p className="text-sm mt-1">{faq.answer}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFAQ(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Prerequisites */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Prasyarat</h3>
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-end gap-4 mb-3">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prasyarat
              </label>
              <input
                type="text"
                value={newPrerequisite}
                onChange={(e) => setNewPrerequisite(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleAddPrerequisite}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tambah
            </button>
          </div>
        </div>
        
        {/* List of prerequisites */}
        {detailedEvent.prerequisites && detailedEvent.prerequisites.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Daftar Prasyarat</h4>
            <div className="space-y-2">
              {detailedEvent.prerequisites.map((prereq, index) => (
                <div key={index} className="flex justify-between items-center p-2 border border-gray-200 rounded-lg">
                  <span>{prereq}</span>
                  <button
                    onClick={() => handleRemovePrerequisite(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Benefits */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Manfaat</h3>
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-end gap-4 mb-3">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Manfaat
              </label>
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleAddBenefit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tambah
            </button>
          </div>
        </div>
        
        {/* List of benefits */}
        {detailedEvent.benefits.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Daftar Manfaat</h4>
            <div className="space-y-2">
              {detailedEvent.benefits.map((benefit, index) => (
                <div key={index} className="flex justify-between items-center p-2 border border-gray-200 rounded-lg">
                  <span>{benefit}</span>
                  <button
                    onClick={() => handleRemoveBenefit(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Simpan Detail Event
        </button>
      </div>
    </div>
  );
};

export default DetailedEventForm;
