import { z } from 'zod'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  listEvents,
  getEvent,
  searchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  checkConflict,
  listNotifications,
  listIntegrations,
} from './db.js'

const eventSchema = {
  title: z.string().min(1).describe('Event title'),
  description: z.string().optional().describe('Event description'),
  event_date: z.string().describe('Date in YYYY-MM-DD format'),
  event_time: z.string().optional().describe('Time in HH:MM:SS format'),
  duration_minutes: z.number().int().positive().optional().describe('Duration in minutes'),
  status: z.enum(['pending', 'completed', 'cancelled']).optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  is_all_day: z.boolean().optional(),
  end_date: z.string().optional().describe('End date for multi-day events (YYYY-MM-DD)'),
  recurrence_rule: z.string().optional().describe("Recurrence rule: 'daily:N', 'weekly:N', 'monthly:N', 'yearly:N'"),
  recurrence_end_date: z.string().optional().describe('Recurrence end date (YYYY-MM-DD)'),
  whatsapp_reminder: z.boolean().optional(),
  email_reminder: z.boolean().optional(),
  reminder_before_minutes: z.number().int().optional().describe('Reminder offset before the event in minutes'),
  sync_google: z.boolean().optional(),
  sync_outlook: z.boolean().optional(),
}

export function createMcpServer() {
  const server = new McpServer({
    name: 'personal-calendar',
    version: '1.0.0',
  })

  server.registerTool(
    'list_events',
    {
      title: 'List events',
      description: 'List calendar events. Optional filters: date range, status, category.',
      inputSchema: {
        start_date: z.string().optional().describe('Filter: only events on or after this date (YYYY-MM-DD)'),
        end_date: z.string().optional().describe('Filter: only events on or before this date (YYYY-MM-DD)'),
        status: z.enum(['pending', 'completed', 'cancelled']).optional(),
        category: z.string().optional(),
      },
    },
    async ({ start_date, end_date, status, category }) => {
      const events = await listEvents({
        startDate: start_date,
        endDate: end_date,
        status,
        category,
      })
      return { content: [{ type: 'text', text: JSON.stringify(events, null, 2) }] }
    }
  )

  server.registerTool(
    'get_event',
    {
      title: 'Get event by ID',
      description: 'Fetch a single calendar event by its UUID.',
      inputSchema: { id: z.string().describe('Event UUID') },
    },
    async ({ id }) => {
      const event = await getEvent(id)
      return { content: [{ type: 'text', text: JSON.stringify(event, null, 2) }] }
    }
  )

  server.registerTool(
    'search_events',
    {
      title: 'Search events',
      description: 'Search events by keyword in the title, description, or category.',
      inputSchema: { query: z.string().min(1).describe('Keyword to search') },
    },
    async ({ query }) => {
      const events = await searchEvents(query)
      return { content: [{ type: 'text', text: JSON.stringify(events, null, 2) }] }
    }
  )

  server.registerTool(
    'create_event',
    {
      title: 'Create event',
      description: 'Create a new calendar event.',
      inputSchema: eventSchema,
    },
    async (args) => {
      const event = await createEvent(args)
      return { content: [{ type: 'text', text: JSON.stringify(event, null, 2) }] }
    }
  )

  server.registerTool(
    'update_event',
    {
      title: 'Update event',
      description: 'Update fields of an existing event by UUID.',
      inputSchema: {
        id: z.string().describe('Event UUID'),
        ...eventSchema,
      },
    },
    async ({ id, ...updates }) => {
      const event = await updateEvent(id, updates)
      return { content: [{ type: 'text', text: JSON.stringify(event, null, 2) }] }
    }
  )

  server.registerTool(
    'delete_event',
    {
      title: 'Delete event',
      description: 'Delete an event by UUID (and its recurring instances).',
      inputSchema: { id: z.string().describe('Event UUID') },
    },
    async ({ id }) => {
      const result = await deleteEvent(id)
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.registerTool(
    'check_conflict',
    {
      title: 'Check for scheduling conflicts',
      description: 'Check whether a proposed time slot overlaps any existing event.',
      inputSchema: {
        event_date: z.string().describe('Date in YYYY-MM-DD format'),
        event_time: z.string().describe('Time in HH:MM:SS format'),
        duration_minutes: z.number().int().positive().optional().default(60),
        exclude_id: z.string().optional().describe('Event UUID to ignore (when rescheduling)'),
      },
    },
    async ({ event_date, event_time, duration_minutes, exclude_id }) => {
      const conflicts = await checkConflict({
        eventDate: event_date,
        eventTime: event_time,
        durationMinutes: duration_minutes,
        excludeId: exclude_id,
      })
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ has_conflict: conflicts.length > 0, conflicts }, null, 2),
          },
        ],
      }
    }
  )

  server.registerTool(
    'list_notifications',
    {
      title: 'List notifications',
      description: 'List reminders/notifications. Optional filters: event ID, status, channel.',
      inputSchema: {
        event_id: z.string().optional().describe('Filter by event UUID'),
        status: z.enum(['pending', 'sent', 'failed']).optional(),
        channel: z.enum(['whatsapp', 'email']).optional(),
      },
    },
    async ({ event_id, status, channel }) => {
      const notifications = await listNotifications({
        eventId: event_id,
        status,
        channel,
      })
      return { content: [{ type: 'text', text: JSON.stringify(notifications, null, 2) }] }
    }
  )

  server.registerTool(
    'list_integrations',
    {
      title: 'List integrations',
      description: 'Show connection status of Google Calendar, Outlook, and WhatsApp integrations.',
      inputSchema: {},
    },
    async () => {
      const integrations = await listIntegrations()
      return { content: [{ type: 'text', text: JSON.stringify(integrations, null, 2) }] }
    }
  )

  return server
}
