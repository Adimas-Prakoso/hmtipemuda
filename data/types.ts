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

export interface PaymentInfoType {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

export interface DetailedEventType extends EventType {
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
  paymentInfo?: PaymentInfoType;
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

// Helper functions to work with events
export function getEventById(id: string, events: EventType[]): EventType | undefined {
  return events.find(event => event.id === id);
}

export function getDetailedEventById(id: string, detailedEvents: Record<string, DetailedEventType>): DetailedEventType | undefined {
  return detailedEvents[id];
}

export function getUpcomingEvents(events: EventType[], limit?: number): EventType[] {
  const now = new Date();
  const upcoming = events
    .filter(event => new Date(event.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getEventsByCategory(events: EventType[], category: string): EventType[] {
  return events.filter(event => event.category === category);
}
