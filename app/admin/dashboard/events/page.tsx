"use client";

import { useState, useEffect } from "react";
import { EventType, DetailedEventType, events as initialEvents } from "../../../../data/events";

interface EventsAdminProps {
  onUpdateEvents?: (events: EventType[]) => void;
}

const EventsAdmin = ({ onUpdateEvents }: EventsAdminProps) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<EventType>>({
    id: "",
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    featured: false,
    category: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [detailedEvents, setDetailedEvents] = useState<Record<string, DetailedEventType>>({});

  useEffect(() => {
    // Load events from localStorage if available, otherwise use initial events
    const storedEvents = localStorage.getItem("hmtiEvents");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      setEvents(initialEvents);
    }
    
    // Load detailed events
    const storedDetailedEvents = localStorage.getItem("hmtiDetailedEvents");
    if (storedDetailedEvents) {
      setDetailedEvents(JSON.parse(storedDetailedEvents));
    }
  }, []);

  useEffect(() => {
    // Notify parent component when events change
    if (onUpdateEvents && events.length > 0) {
      onUpdateEvents(events);
    }
    
    // Save to localStorage
    if (events.length > 0) {
      localStorage.setItem("hmtiEvents", JSON.stringify(events));
    }
  }, [events, onUpdateEvents]);
  
  useEffect(() => {
    // Save detailed events to localStorage
    if (Object.keys(detailedEvents).length > 0) {
      localStorage.setItem("hmtiDetailedEvents", JSON.stringify(detailedEvents));
    }
  }, [detailedEvents]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (editingId) {
      // Editing existing event
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === editingId 
            ? { 
                ...event, 
                [name]: type === "checkbox" 
                  ? (e.target as HTMLInputElement).checked 
                  : value 
              } 
            : event
        )
      );
    } else {
      // Adding new event
      setNewEvent((prev: Partial<EventType>) => ({
        ...prev,
        [name]: type === "checkbox" 
          ? (e.target as HTMLInputElement).checked 
          : value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (editingId) {
      // Editing existing event
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === editingId 
            ? { ...event, [name]: checked } 
            : event
        )
      );
    } else {
      // Adding new event
      setNewEvent((prev: Partial<EventType>) => ({
        ...prev,
        [name]: checked
      }));
    }
  };

  const generateId = () => {
    return `ev${Math.floor(Math.random() * 10000)}`;
  };

  const handleAddEvent = () => {
    // Validate form
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location || !newEvent.category) {
      setErrorMessage("Semua field harus diisi kecuali Registration Link");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const eventToAdd: EventType = {
      id: newEvent.id || generateId(),
      title: newEvent.title || "",
      date: newEvent.date || "",
      time: newEvent.time || "",
      location: newEvent.location || "",
      description: newEvent.description || "",
      featured: newEvent.featured || false,
      registrationLink: newEvent.registrationLink || `/events/${newEvent.id || generateId()}`,
      category: newEvent.category || "",
    };

    setEvents(prev => [...prev, eventToAdd]);
    setNewEvent({
      id: "",
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      featured: false,
      category: "",
    });
    setIsAdding(false);
    setSuccessMessage("Event berhasil ditambahkan!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleEditEvent = (id: string) => {
    const eventToEdit = events.find(event => event.id === id);
    if (eventToEdit) {
      setEditingId(id);
      setIsAdding(true);
      
      // Load the detailed form with the event data
      const currentDetailedEvent = detailedEvents[id];
      if (currentDetailedEvent) {
        // Detailed event data already exists, no need to do anything
      }
    }
  };

  const handleUpdateEvent = () => {
    if (!editingId) return;
    
    const updatedEvent = events.find(event => event.id === editingId);
    if (updatedEvent) {
      // Update detailed event if it exists
      if (detailedEvents[editingId]) {
        const updatedDetailedEvent = {
          ...detailedEvents[editingId],
          ...updatedEvent
        };
        
        setDetailedEvents(prev => ({
          ...prev,
          [editingId]: updatedDetailedEvent
        }));
      }
    }
    
    setEditingId(null);
    setIsAdding(false);
    setSuccessMessage("Event berhasil diperbarui!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus event ini?")) {
      setEvents(prev => prev.filter(event => event.id !== id));
      
      // Also remove from detailed events if exists
      if (detailedEvents[id]) {
        const updatedDetailedEvents = { ...detailedEvents };
        delete updatedDetailedEvents[id];
        setDetailedEvents(updatedDetailedEvents);
      }
      
      setSuccessMessage("Event berhasil dihapus!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewEvent({
      id: "",
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      featured: false,
      category: "",
    });
  };
  


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-white">Kelola Events</h3>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tambah Event
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      {isAdding && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h4 className="text-md font-medium mb-4">
            {editingId ? "Edit Event" : "Tambah Event Baru"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Informasi Dasar</h4>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Judul Event
              </label>
              <input
                type="text"
                name="title"
                value={editingId ? events.find(e => e.id === editingId)?.title || "" : newEvent.title || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kategori
              </label>
              <select
                name="category"
                value={editingId ? events.find(e => e.id === editingId)?.category || "" : newEvent.category || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Kategori</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Kompetisi">Kompetisi</option>
                <option value="Webinar">Webinar</option>
                <option value="Pelatihan">Pelatihan</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Tech Talk">Tech Talk</option>
                <option value="Diskusi">Diskusi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tanggal
              </label>
              <input
                type="datetime-local"
                name="date"
                value={editingId 
                  ? events.find(e => e.id === editingId)?.date.slice(0, 16) || "" 
                  : newEvent.date || ""
                }
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Waktu
              </label>
              <input
                type="text"
                name="time"
                placeholder="10:00 - 14:00"
                value={editingId ? events.find(e => e.id === editingId)?.time || "" : newEvent.time || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lokasi
              </label>
              <input
                type="text"
                name="location"
                value={editingId ? events.find(e => e.id === editingId)?.location || "" : newEvent.location || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Link Pendaftaran
              </label>
              <input
                type="text"
                name="registrationLink"
                value={editingId ? events.find(e => e.id === editingId)?.registrationLink || "" : newEvent.registrationLink || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deskripsi
              </label>
              <textarea
                name="description"
                rows={3}
                value={editingId ? events.find(e => e.id === editingId)?.description || "" : newEvent.description || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={editingId 
                  ? events.find(e => e.id === editingId)?.featured || false 
                  : newEvent.featured || false
                }
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Featured Event
              </label>
            </div>
          </div>
          {/* Detailed Event Form when editing */}
          {editingId && (
            <div className="md:col-span-2 mt-6 border-t pt-6">
              <h4 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Informasi Detail Event</h4>
              
              {/* Organizer */}
              <div className="mb-6">
                <h5 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">Informasi Penyelenggara</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Penyelenggara
                    </label>
                    <input
                      type="text"
                      name="organizer"
                      value={detailedEvents[editingId]?.organizer || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDetailedEvents(prev => ({
                          ...prev,
                          [editingId]: {
                            ...prev[editingId] || {
                              ...events.find(event => event.id === editingId)!,
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
                            },
                            organizer: value
                          }
                        }));
                      }}
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
                      value={detailedEvents[editingId]?.registrationDeadline?.slice(0, 16) || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDetailedEvents(prev => ({
                          ...prev,
                          [editingId]: {
                            ...prev[editingId] || {
                              ...events.find(event => event.id === editingId)!,
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
                            },
                            registrationDeadline: value
                          }
                        }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Participants and Price */}
              <div className="mb-6">
                <h5 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">Peserta & Biaya</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Jumlah Maksimal Peserta
                    </label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={detailedEvents[editingId]?.maxParticipants || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setDetailedEvents(prev => ({
                          ...prev,
                          [editingId]: {
                            ...prev[editingId] || {
                              ...events.find(event => event.id === editingId)!,
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
                            },
                            maxParticipants: value
                          }
                        }));
                      }}
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
                      value={detailedEvents[editingId]?.currentParticipants || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setDetailedEvents(prev => ({
                          ...prev,
                          [editingId]: {
                            ...prev[editingId] || {
                              ...events.find(event => event.id === editingId)!,
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
                            },
                            currentParticipants: value
                          }
                        }));
                      }}
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
                      value={typeof detailedEvents[editingId]?.price === 'number' ? detailedEvents[editingId]?.price.toString() : detailedEvents[editingId]?.price || "Gratis"}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDetailedEvents(prev => ({
                          ...prev,
                          [editingId]: {
                            ...prev[editingId] || {
                              ...events.find(event => event.id === editingId)!,
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
                            },
                            price: value === "Gratis" ? "Gratis" : parseInt(value) || 0
                          }
                        }));
                      }}
                      placeholder="Contoh: 50000 atau 'Gratis'"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Contact Person */}
              <div className="mb-6">
                <h5 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">Kontak Person</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nama
                    </label>
                    <input
                      type="text"
                      name="contactPersonName"
                      value={detailedEvents[editingId]?.contactPerson?.name || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDetailedEvents(prev => ({
                          ...prev,
                          [editingId]: {
                            ...prev[editingId] || {
                              ...events.find(event => event.id === editingId)!,
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
                            },
                            contactPerson: {
                              ...prev[editingId]?.contactPerson || {
                                name: "",
                                phone: "",
                                email: "",
                                whatsapp: ""
                              },
                              name: value
                            }
                          }
                        }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="contactPersonEmail"
                      value={detailedEvents[editingId]?.contactPerson?.email || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDetailedEvents(prev => ({
                          ...prev,
                          [editingId]: {
                            ...prev[editingId] || {
                              ...events.find(event => event.id === editingId)!,
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
                            },
                            contactPerson: {
                              ...prev[editingId]?.contactPerson || {
                                name: "",
                                phone: "",
                                email: "",
                                whatsapp: ""
                              },
                              email: value
                            }
                          }
                        }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Telepon
                    </label>
                    <input
                      type="text"
                      name="contactPersonPhone"
                      value={detailedEvents[editingId]?.contactPerson?.phone || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDetailedEvents(prev => ({
                          ...prev,
                          [editingId]: {
                            ...prev[editingId] || {
                              ...events.find(event => event.id === editingId)!,
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
                            },
                            contactPerson: {
                              ...prev[editingId]?.contactPerson || {
                                name: "",
                                phone: "",
                                email: "",
                                whatsapp: ""
                              },
                              phone: value
                            }
                          }
                        }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      name="contactPersonWhatsapp"
                      value={detailedEvents[editingId]?.contactPerson?.whatsapp || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDetailedEvents(prev => ({
                          ...prev,
                          [editingId]: {
                            ...prev[editingId] || {
                              ...events.find(event => event.id === editingId)!,
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
                            },
                            contactPerson: {
                              ...prev[editingId]?.contactPerson || {
                                name: "",
                                phone: "",
                                email: "",
                                whatsapp: ""
                              },
                              whatsapp: value
                            }
                          }
                        }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 md:col-span-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={editingId ? handleUpdateEvent : handleAddEvent}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingId ? "Update" : "Simpan"}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Event
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tanggal
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Kategori
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Featured
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Tidak ada event yang tersedia
                </td>
              </tr>
            ) : (
              events.map(event => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{event.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{formatDate(event.date)}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{event.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {event.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {event.featured ? (
                      <span className="text-green-600">Ya</span>
                    ) : (
                      <span>Tidak</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditEvent(event.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default EventsAdmin;
