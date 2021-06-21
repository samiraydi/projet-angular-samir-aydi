import { Injectable } from '@angular/core';
import { getGlobal, setGlobal } from 'src/app/app-config';
import { Event } from "src/models/event.model";
import { AuthService } from '../AuthService';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private authService: AuthService) {}

  private getEvents(): Event[] {
    return getGlobal()['events'];
  }

  private setEvents(events: Event[]): void {
    setGlobal({
      ...getGlobal(),
      events
    });
  }

  getById(id: string): Promise<Event | null> {
    return Promise.resolve(this.getEvents().find(item => item.id === id) || null);
  }

  getAll(): Promise<Event[]> {
    return Promise.resolve(this.getEvents());
  }

  addEvent(event: Event): Promise<Event> {
    event = this.prepareEventToSave(event);
    this.saveEvent(event);
    return Promise.resolve(event);
  }

  edit(id: string, event: Event): Promise<Event | null> {
    const events = this.getEvents();
    const eventIndex = events.findIndex(item => item.id === id);

    if (eventIndex === -1) {
      return Promise.resolve(null);
    }
    events[eventIndex] = this.prepareEventToEdit(events[eventIndex], event);
    this.setEvents(events);

    return Promise.resolve(events[eventIndex]);
  }

  delete(id: string): Promise<void> {
    const events = this.getEvents();
    this.setEvents(events.filter(item => item.id !== id));
    return Promise.resolve();
  }

  private prepareEventToSave(event: Event): Event {
    const creationDate = new Date();
    return {
      ...event,
      id: creationDate.getTime().toString(),
      publisher_id: this.authService.currentUserState.id
    };
  }

  private prepareEventToEdit(eventOldData: Event, eventNewData: Event): Event {
    return {
      ...eventNewData,
      id: eventOldData.id,
      publisher_id: eventOldData.publisher_id
    };
  }

  private saveEvent(event: Event) {
    const events = this.getEvents();
    events.push(event);
    this.setEvents(events);
  }
}
