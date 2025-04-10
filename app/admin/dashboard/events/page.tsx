"use client";

import { useState, useEffect } from "react";
import { EventType, DetailedEventType } from "../../../../data/types";
import Image from "next/image";

interface EventsAdminProps {
  onUpdateEvents?: (events: EventType[]) => void;
}

// Function to save events to events.json via API
const saveEventsToJson = async (events: EventType[], detailedEvents: Record<string, DetailedEventType>) => {
  try {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events, detailedEvents }),
    });
    
    if (!response.ok) {
      console.error('Failed to save events to JSON file');
    }
  } catch (error) {
    console.error('Error saving events:', error);
  }
};

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
  const [newDetailedEvent, setNewDetailedEvent] = useState<Partial<DetailedEventType>>({    
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

  useEffect(() => {
    // Load events from localStorage if available, otherwise fetch from API
    const storedEvents = localStorage.getItem("hmtiEvents");
    const storedDetailedEvents = localStorage.getItem("hmtiDetailedEvents");
    
    if (storedEvents && storedDetailedEvents) {
      setEvents(JSON.parse(storedEvents));
      setDetailedEvents(JSON.parse(storedDetailedEvents));
    } else {
      // Fetch events from API
      fetch('/api/events')
        .then(response => response.json())
        .then(data => {
          setEvents(data.events || []);
          setDetailedEvents(data.detailedEvents || {});
          
          // Update localStorage
          localStorage.setItem("hmtiEvents", JSON.stringify(data.events || []));
          localStorage.setItem("hmtiDetailedEvents", JSON.stringify(data.detailedEvents || {}));
        })
        .catch(error => {
          console.error('Error fetching events:', error);
        });
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
      
      // Save to events.json via API
      saveEventsToJson(events, detailedEvents);
    }
  }, [events, onUpdateEvents, detailedEvents]);
  
  useEffect(() => {
    // Save detailed events to localStorage
    if (Object.keys(detailedEvents).length > 0) {
      localStorage.setItem("hmtiDetailedEvents", JSON.stringify(detailedEvents));
      
      // Save to events.json via API if events exist
      if (events.length > 0) {
        saveEventsToJson(events, detailedEvents);
      }
    }
  }, [detailedEvents, events]);

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
    // Characters to use for random ID (uppercase, lowercase, numbers)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    
    // Generate 8 random characters
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return id;
  };

  const handleAddEvent = () => {
    // Validate form
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location || !newEvent.category) {
      setErrorMessage("Semua field harus diisi kecuali Registration Link");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const eventId = newEvent.id || generateId();
    const eventToAdd: EventType = {
      id: eventId,
      title: newEvent.title || "",
      date: newEvent.date || "",
      time: newEvent.time || "",
      location: newEvent.location || "",
      description: newEvent.description || "",
      featured: newEvent.featured || false,
      registrationLink: `/events/${eventId}`,
      category: newEvent.category || "",
    };

    // Add the event to the events list
    setEvents(prev => [...prev, eventToAdd]);
    
    // If detailed event information was provided, save it
    if (newDetailedEvent.organizer || 
        (newDetailedEvent.maxParticipants && newDetailedEvent.maxParticipants > 0) || 
        newDetailedEvent.registrationDeadline || 
        (newDetailedEvent.contactPerson && newDetailedEvent.contactPerson.name)) {
      
      // Create a detailed event object
      const detailedEventToAdd: DetailedEventType = {
        ...eventToAdd,
        organizer: newDetailedEvent.organizer || "",
        speakers: newDetailedEvent.speakers || [],
        agenda: newDetailedEvent.agenda || [],
        prerequisites: newDetailedEvent.prerequisites || [],
        maxParticipants: newDetailedEvent.maxParticipants || 0,
        currentParticipants: newDetailedEvent.currentParticipants || 0,
        registrationDeadline: newDetailedEvent.registrationDeadline || "",
        price: newDetailedEvent.price || "Gratis",
        benefits: newDetailedEvent.benefits || [],
        contactPerson: newDetailedEvent.contactPerson || {
          name: "",
          phone: "",
          email: "",
          whatsapp: ""
        },
        faqs: newDetailedEvent.faqs || [],
        images: newDetailedEvent.images || []
      };
      
      // Save the detailed event
      setDetailedEvents(prev => ({
        ...prev,
        [eventId]: detailedEventToAdd
      }));
    }
    
    // Reset form
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
    
    // Reset detailed event form
    setNewDetailedEvent({
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

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus event ini?")) {
      // Update local state
      setEvents(prev => prev.filter(event => event.id !== id));
      
      // Also remove from detailed events if exists
      if (detailedEvents[id]) {
        const updatedDetailedEvents = { ...detailedEvents };
        delete updatedDetailedEvents[id];
        setDetailedEvents(updatedDetailedEvents);
      }
      
      // Delete from events.json via API
      try {
        const response = await fetch('/api/events/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        
        if (!response.ok) {
          console.error('Failed to delete event from JSON file');
          setErrorMessage("Gagal menghapus event dari server. Event dihapus dari tampilan saja.");
          setTimeout(() => setErrorMessage(""), 3000);
          return;
        }
        
        setSuccessMessage("Event berhasil dihapus!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error('Error deleting event:', error);
        setErrorMessage("Terjadi kesalahan saat menghapus event. Event dihapus dari tampilan saja.");
        setTimeout(() => setErrorMessage(""), 3000);
      }
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
          
          {/* Detailed Event Form for both adding and editing */}
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
                    value={editingId 
                      ? detailedEvents[editingId]?.organizer || "" 
                      : newDetailedEvent.organizer || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (editingId) {
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
                      } else {
                        setNewDetailedEvent(prev => ({
                          ...prev,
                          organizer: value
                        }));
                      }
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
                    value={editingId 
                      ? detailedEvents[editingId]?.registrationDeadline?.slice(0, 16) || "" 
                      : newDetailedEvent.registrationDeadline?.slice(0, 16) || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (editingId) {
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
                      } else {
                        setNewDetailedEvent(prev => ({
                          ...prev,
                          registrationDeadline: value
                        }));
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maksimum Peserta
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={editingId 
                      ? detailedEvents[editingId]?.maxParticipants || 0 
                      : newDetailedEvent.maxParticipants || 0}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (editingId) {
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
                      } else {
                        setNewDetailedEvent(prev => ({
                          ...prev,
                          maxParticipants: value
                        }));
                      }
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
                    value={editingId 
                      ? detailedEvents[editingId]?.currentParticipants || 0 
                      : newDetailedEvent.currentParticipants || 0}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (editingId) {
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
                      } else {
                        setNewDetailedEvent(prev => ({
                          ...prev,
                          currentParticipants: value
                        }));
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Harga
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={editingId 
                      ? (typeof detailedEvents[editingId]?.price === 'number' 
                          ? detailedEvents[editingId]?.price.toString() 
                          : detailedEvents[editingId]?.price || "Gratis") 
                      : (typeof newDetailedEvent.price === 'number' 
                          ? newDetailedEvent.price.toString() 
                          : newDetailedEvent.price || "Gratis")}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (editingId) {
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
                      } else {
                        setNewDetailedEvent(prev => ({
                          ...prev,
                          price: value === "Gratis" ? "Gratis" : parseInt(value) || 0
                        }));
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Speakers */}
            <div className="mb-6">
              <h5 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">Pembicara</h5>
              <div className="border border-gray-200 rounded-md p-4 mb-4">
                {(editingId ? detailedEvents[editingId]?.speakers || [] : newDetailedEvent.speakers || []).map((speaker, index) => (
                  <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <h6 className="font-medium">Pembicara {index + 1}</h6>
                      <button 
                        type="button"
                        onClick={() => {
                          if (editingId) {
                            setDetailedEvents(prev => {
                              const updated = {...prev};
                              const updatedSpeakers = [...(updated[editingId]?.speakers || [])];
                              updatedSpeakers.splice(index, 1);
                              updated[editingId] = {
                                ...updated[editingId],
                                speakers: updatedSpeakers
                              };
                              return updated;
                            });
                          } else {
                            setNewDetailedEvent(prev => {
                              const updatedSpeakers = [...(prev.speakers || [])];
                              updatedSpeakers.splice(index, 1);
                              return {
                                ...prev,
                                speakers: updatedSpeakers
                              };
                            });
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nama
                        </label>
                        <input
                          type="text"
                          value={speaker.name}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (editingId) {
                              setDetailedEvents(prev => {
                                const updated = {...prev};
                                const updatedSpeakers = [...(updated[editingId]?.speakers || [])];
                                updatedSpeakers[index] = {...updatedSpeakers[index], name: value};
                                updated[editingId] = {
                                  ...updated[editingId],
                                  speakers: updatedSpeakers
                                };
                                return updated;
                              });
                            } else {
                              setNewDetailedEvent(prev => {
                                const updatedSpeakers = [...(prev.speakers || [])];
                                updatedSpeakers[index] = {...updatedSpeakers[index], name: value};
                                return {
                                  ...prev,
                                  speakers: updatedSpeakers
                                };
                              });
                            }
                          }}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Jabatan/Peran
                        </label>
                        <input
                          type="text"
                          value={speaker.role}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (editingId) {
                              setDetailedEvents(prev => {
                                const updated = {...prev};
                                const updatedSpeakers = [...(updated[editingId]?.speakers || [])];
                                updatedSpeakers[index] = {...updatedSpeakers[index], role: value};
                                updated[editingId] = {
                                  ...updated[editingId],
                                  speakers: updatedSpeakers
                                };
                                return updated;
                              });
                            } else {
                              setNewDetailedEvent(prev => {
                                const updatedSpeakers = [...(prev.speakers || [])];
                                updatedSpeakers[index] = {...updatedSpeakers[index], role: value};
                                return {
                                  ...prev,
                                  speakers: updatedSpeakers
                                };
                              });
                            }
                          }}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bio
                        </label>
                        <textarea
                          value={speaker.bio}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (editingId) {
                              setDetailedEvents(prev => {
                                const updated = {...prev};
                                const updatedSpeakers = [...(updated[editingId]?.speakers || [])];
                                updatedSpeakers[index] = {...updatedSpeakers[index], bio: value};
                                updated[editingId] = {
                                  ...updated[editingId],
                                  speakers: updatedSpeakers
                                };
                                return updated;
                              });
                            } else {
                              setNewDetailedEvent(prev => {
                                const updatedSpeakers = [...(prev.speakers || [])];
                                updatedSpeakers[index] = {...updatedSpeakers[index], bio: value};
                                return {
                                  ...prev,
                                  speakers: updatedSpeakers
                                };
                              });
                            }
                          }}
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Foto Pembicara (opsional)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={speaker.image || ''}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (editingId) {
                                    setDetailedEvents(prev => {
                                      const updated = {...prev};
                                      const updatedSpeakers = [...(updated[editingId]?.speakers || [])];
                                      updatedSpeakers[index] = {...updatedSpeakers[index], image: value};
                                      updated[editingId] = {
                                        ...updated[editingId],
                                        speakers: updatedSpeakers
                                      };
                                      return updated;
                                    });
                                  } else {
                                    setNewDetailedEvent(prev => {
                                      const updatedSpeakers = [...(prev.speakers || [])];
                                      updatedSpeakers[index] = {...updatedSpeakers[index], image: value};
                                      return {
                                        ...prev,
                                        speakers: updatedSpeakers
                                      };
                                    });
                                  }
                                }}
                                placeholder="URL atau path ke file di folder public"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Masukkan URL lengkap (https://...) atau path relatif dari folder public (contoh: /images/speakers/foto.jpg)</p>
                          </div>
                          <div>
                            {speaker.image && (
                              <div className="mt-2">
                                <p className="text-sm font-medium mb-1">Preview:</p>
                                <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 relative">
                                  <Image 
                                    src={speaker.image.startsWith('http') ? speaker.image : speaker.image.startsWith('/') ? speaker.image : `/${speaker.image}`} 
                                    alt={`${speaker.name}`}
                                    fill
                                    sizes="(max-width: 768px) 100px, 96px"
                                    className="object-cover"
                                    onError={() => {
                                      // We'll handle errors differently with Next.js Image
                                      console.error(`Failed to load speaker image: ${speaker.image}`);
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newSpeaker = { name: "", role: "", bio: "", image: "" };
                    if (editingId) {
                      setDetailedEvents(prev => {
                        const updated = {...prev};
                        const updatedSpeakers = [...(updated[editingId]?.speakers || [])];
                        updatedSpeakers.push(newSpeaker);
                        updated[editingId] = {
                          ...updated[editingId],
                          speakers: updatedSpeakers
                        };
                        return updated;
                      });
                    } else {
                      setNewDetailedEvent(prev => ({
                        ...prev,
                        speakers: [...(prev.speakers || []), newSpeaker]
                      }));
                    }
                  }}
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Pembicara
                </button>
              </div>
            </div>
            
            {/* Agenda */}
            <div className="mb-6">
              <h5 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">Agenda Acara</h5>
              <div className="border border-gray-200 rounded-md p-4 mb-4">
                {(editingId ? detailedEvents[editingId]?.agenda || [] : newDetailedEvent.agenda || []).map((item, index) => (
                  <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <h6 className="font-medium">Agenda {index + 1}</h6>
                      <button 
                        type="button"
                        onClick={() => {
                          if (editingId) {
                            setDetailedEvents(prev => {
                              const updated = {...prev};
                              const updatedAgenda = [...(updated[editingId]?.agenda || [])];
                              updatedAgenda.splice(index, 1);
                              updated[editingId] = {
                                ...updated[editingId],
                                agenda: updatedAgenda
                              };
                              return updated;
                            });
                          } else {
                            setNewDetailedEvent(prev => {
                              const updatedAgenda = [...(prev.agenda || [])];
                              updatedAgenda.splice(index, 1);
                              return {
                                ...prev,
                                agenda: updatedAgenda
                              };
                            });
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Waktu
                        </label>
                        <input
                          type="text"
                          value={item.time}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (editingId) {
                              setDetailedEvents(prev => {
                                const updated = {...prev};
                                const updatedAgenda = [...(updated[editingId]?.agenda || [])];
                                updatedAgenda[index] = {...updatedAgenda[index], time: value};
                                updated[editingId] = {
                                  ...updated[editingId],
                                  agenda: updatedAgenda
                                };
                                return updated;
                              });
                            } else {
                              setNewDetailedEvent(prev => {
                                const updatedAgenda = [...(prev.agenda || [])];
                                updatedAgenda[index] = {...updatedAgenda[index], time: value};
                                return {
                                  ...prev,
                                  agenda: updatedAgenda
                                };
                              });
                            }
                          }}
                          placeholder="09:00 - 10:00"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Judul
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (editingId) {
                              setDetailedEvents(prev => {
                                const updated = {...prev};
                                const updatedAgenda = [...(updated[editingId]?.agenda || [])];
                                updatedAgenda[index] = {...updatedAgenda[index], title: value};
                                updated[editingId] = {
                                  ...updated[editingId],
                                  agenda: updatedAgenda
                                };
                                return updated;
                              });
                            } else {
                              setNewDetailedEvent(prev => {
                                const updatedAgenda = [...(prev.agenda || [])];
                                updatedAgenda[index] = {...updatedAgenda[index], title: value};
                                return {
                                  ...prev,
                                  agenda: updatedAgenda
                                };
                              });
                            }
                          }}
                          placeholder="Sesi Pembukaan"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Deskripsi (opsional)
                        </label>
                        <textarea
                          value={item.description || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (editingId) {
                              setDetailedEvents(prev => {
                                const updated = {...prev};
                                const updatedAgenda = [...(updated[editingId]?.agenda || [])];
                                updatedAgenda[index] = {...updatedAgenda[index], description: value};
                                updated[editingId] = {
                                  ...updated[editingId],
                                  agenda: updatedAgenda
                                };
                                return updated;
                              });
                            } else {
                              setNewDetailedEvent(prev => {
                                const updatedAgenda = [...(prev.agenda || [])];
                                updatedAgenda[index] = {...updatedAgenda[index], description: value};
                                return {
                                  ...prev,
                                  agenda: updatedAgenda
                                };
                              });
                            }
                          }}
                          rows={2}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newAgendaItem = { time: "", title: "", description: "" };
                    if (editingId) {
                      setDetailedEvents(prev => {
                        const updated = {...prev};
                        const updatedAgenda = [...(updated[editingId]?.agenda || [])];
                        updatedAgenda.push(newAgendaItem);
                        updated[editingId] = {
                          ...updated[editingId],
                          agenda: updatedAgenda
                        };
                        return updated;
                      });
                    } else {
                      setNewDetailedEvent(prev => ({
                        ...prev,
                        agenda: [...(prev.agenda || []), newAgendaItem]
                      }));
                    }
                  }}
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Agenda
                </button>
              </div>
            </div>
            
            {/* Prerequisites */}
            <div className="mb-6">
              <h5 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">Prasyarat</h5>
              <div className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prasyarat (satu per baris)
                  </label>
                  <textarea
                    value={(editingId 
                      ? detailedEvents[editingId]?.prerequisites || [] 
                      : newDetailedEvent.prerequisites || []).join('\n')}
                    onChange={(e) => {
                      const value = e.target.value;
                      const prerequisites = value.split('\n').filter(item => item.trim() !== '');
                      
                      if (editingId) {
                        setDetailedEvents(prev => ({
                          ...prev,
                          [editingId]: {
                            ...prev[editingId],
                            prerequisites
                          }
                        }));
                      } else {
                        setNewDetailedEvent(prev => ({
                          ...prev,
                          prerequisites
                        }));
                      }
                    }}
                    rows={4}
                    placeholder="Laptop\nInternet\nPengetahuan dasar tentang..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Masukkan setiap prasyarat pada baris baru</p>
                </div>
              </div>
            </div>
            
            {/* Benefits */}
            <div className="mb-6">
              <h5 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">Manfaat Event</h5>
              <div className="border border-gray-200 rounded-md p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Daftar Manfaat
                  </label>
                  <textarea
                    value={(editingId 
                      ? detailedEvents[editingId]?.benefits || [] 
                      : newDetailedEvent.benefits || []).join('\n')}
                    onChange={(e) => {
                      const value = e.target.value;
                      const benefits = value.split('\n').filter(item => item.trim() !== '');
                      
                      if (editingId) {
                        setDetailedEvents(prev => ({
                          ...prev,
                          [editingId]: {
                            ...prev[editingId],
                            benefits
                          }
                        }));
                      } else {
                        setNewDetailedEvent(prev => ({
                          ...prev,
                          benefits
                        }));
                      }
                    }}
                    rows={4}
                    placeholder="Sertifikat\nKoneksi dengan profesional\nPengetahuan mendalam tentang..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Masukkan setiap manfaat pada baris baru</p>
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
                    value={editingId 
                      ? detailedEvents[editingId]?.contactPerson?.name || "" 
                      : newDetailedEvent.contactPerson?.name || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (editingId) {
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
                      } else {
                        setNewDetailedEvent(prev => {
                          const contactPerson = prev.contactPerson || {
                            name: "",
                            phone: "",
                            email: "",
                            whatsapp: ""
                          };
                          return {
                            ...prev,
                            contactPerson: {
                              ...contactPerson,
                              name: value
                            }
                          };
                        });
                      }
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
                    value={editingId 
                      ? detailedEvents[editingId]?.contactPerson?.email || "" 
                      : newDetailedEvent.contactPerson?.email || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (editingId) {
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
                      } else {
                        setNewDetailedEvent(prev => {
                          const contactPerson = prev.contactPerson || {
                            name: "",
                            phone: "",
                            email: "",
                            whatsapp: ""
                          };
                          return {
                            ...prev,
                            contactPerson: {
                              ...contactPerson,
                              email: value
                            }
                          };
                        });
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telepon
                  </label>
                  <input
                    type="tel"
                    name="contactPersonPhone"
                    value={editingId 
                      ? detailedEvents[editingId]?.contactPerson?.phone || "" 
                      : newDetailedEvent.contactPerson?.phone || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (editingId) {
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
                      } else {
                        setNewDetailedEvent(prev => {
                          const contactPerson = prev.contactPerson || {
                            name: "",
                            phone: "",
                            email: "",
                            whatsapp: ""
                          };
                          return {
                            ...prev,
                            contactPerson: {
                              ...contactPerson,
                              phone: value
                            }
                          };
                        });
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="contactPersonWhatsapp"
                    value={editingId 
                      ? detailedEvents[editingId]?.contactPerson?.whatsapp || "" 
                      : newDetailedEvent.contactPerson?.whatsapp || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (editingId) {
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
                      } else {
                        setNewDetailedEvent(prev => {
                          const contactPerson = prev.contactPerson || {
                            name: "",
                            phone: "",
                            email: "",
                            whatsapp: ""
                          };
                          return {
                            ...prev,
                            contactPerson: {
                              ...contactPerson,
                              whatsapp: value
                            }
                          };
                        });
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* FAQs */}
            <div className="mb-6">
              <h5 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">FAQ</h5>
              <div className="border border-gray-200 rounded-md p-4 mb-4">
                {(editingId ? detailedEvents[editingId]?.faqs || [] : newDetailedEvent.faqs || []).map((faq, index) => (
                  <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <h6 className="font-medium">FAQ {index + 1}</h6>
                      <button 
                        type="button"
                        onClick={() => {
                          if (editingId) {
                            setDetailedEvents(prev => {
                              const updated = {...prev};
                              const updatedFaqs = [...(updated[editingId]?.faqs || [])];
                              updatedFaqs.splice(index, 1);
                              updated[editingId] = {
                                ...updated[editingId],
                                faqs: updatedFaqs
                              };
                              return updated;
                            });
                          } else {
                            setNewDetailedEvent(prev => {
                              const updatedFaqs = [...(prev.faqs || [])];
                              updatedFaqs.splice(index, 1);
                              return {
                                ...prev,
                                faqs: updatedFaqs
                              };
                            });
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Pertanyaan
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (editingId) {
                              setDetailedEvents(prev => {
                                const updated = {...prev};
                                const updatedFaqs = [...(updated[editingId]?.faqs || [])];
                                updatedFaqs[index] = {...updatedFaqs[index], question: value};
                                updated[editingId] = {
                                  ...updated[editingId],
                                  faqs: updatedFaqs
                                };
                                return updated;
                              });
                            } else {
                              setNewDetailedEvent(prev => {
                                const updatedFaqs = [...(prev.faqs || [])];
                                updatedFaqs[index] = {...updatedFaqs[index], question: value};
                                return {
                                  ...prev,
                                  faqs: updatedFaqs
                                };
                              });
                            }
                          }}
                          placeholder="Apa yang perlu dibawa?"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Jawaban
                        </label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (editingId) {
                              setDetailedEvents(prev => {
                                const updated = {...prev};
                                const updatedFaqs = [...(updated[editingId]?.faqs || [])];
                                updatedFaqs[index] = {...updatedFaqs[index], answer: value};
                                updated[editingId] = {
                                  ...updated[editingId],
                                  faqs: updatedFaqs
                                };
                                return updated;
                              });
                            } else {
                              setNewDetailedEvent(prev => {
                                const updatedFaqs = [...(prev.faqs || [])];
                                updatedFaqs[index] = {...updatedFaqs[index], answer: value};
                                return {
                                  ...prev,
                                  faqs: updatedFaqs
                                };
                              });
                            }
                          }}
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newFaq = { question: "", answer: "" };
                    if (editingId) {
                      setDetailedEvents(prev => {
                        const updated = {...prev};
                        const updatedFaqs = [...(updated[editingId]?.faqs || [])];
                        updatedFaqs.push(newFaq);
                        updated[editingId] = {
                          ...updated[editingId],
                          faqs: updatedFaqs
                        };
                        return updated;
                      });
                    } else {
                      setNewDetailedEvent(prev => ({
                        ...prev,
                        faqs: [...(prev.faqs || []), newFaq]
                      }));
                    }
                  }}
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah FAQ
                </button>
              </div>
            </div>
            
            {/* Images */}
            <div className="mb-6">
              <h5 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">Gambar Event</h5>
              <div className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gambar Event (satu per baris)
                  </label>
                  <textarea
                    value={(editingId 
                      ? detailedEvents[editingId]?.images || [] 
                      : newDetailedEvent.images || []).join('\n')}
                    onChange={(e) => {
                      const value = e.target.value;
                      const images = value.split('\n').filter(item => item.trim() !== '');
                      
                      if (editingId) {
                        setDetailedEvents(prev => ({
                          ...prev,
                          [editingId]: {
                            ...prev[editingId],
                            images
                          }
                        }));
                      } else {
                        setNewDetailedEvent(prev => ({
                          ...prev,
                          images
                        }));
                      }
                    }}
                    rows={4}
                    placeholder="https://example.com/image1.jpg\n/images/events/event1.jpg"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Masukkan URL lengkap (https://...) atau path relatif dari folder public (contoh: /images/events/foto.jpg)</p>
                </div>
                
                {/* Image Preview */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview Gambar:</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(editingId 
                      ? detailedEvents[editingId]?.images || [] 
                      : newDetailedEvent.images || []).map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="w-full h-24 border border-gray-300 rounded-md overflow-hidden relative">
                          <Image 
                            src={image.startsWith('http') ? image : image.startsWith('/') ? image : `/${image}`} 
                            alt={`Event image ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100px, 200px"
                            className="object-cover"
                            onError={() => {
                              // We'll handle errors differently with Next.js Image
                              console.error(`Failed to load event image: ${image}`);
                            }}
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const updatedImages = [...(editingId 
                              ? detailedEvents[editingId]?.images || [] 
                              : newDetailedEvent.images || [])];
                            updatedImages.splice(index, 1);
                            
                            if (editingId) {
                              setDetailedEvents(prev => ({
                                ...prev,
                                [editingId]: {
                                  ...prev[editingId],
                                  images: updatedImages
                                }
                              }));
                            } else {
                              setNewDetailedEvent(prev => ({
                                ...prev,
                                images: updatedImages
                              }));
                            }
                          }}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Specific Detailed Event Form sections only for editing */}
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

const EventsPage = () => {
  return <EventsAdmin />;
};

export default EventsPage;
