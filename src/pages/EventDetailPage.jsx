import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EventForm } from '../components/events/EventForm'
import { Button } from '../components/ui/Button'
import { useEvents } from '../hooks/useEvents'
import { useIntegrations } from '../hooks/useIntegrations'

export function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { events, updateEvent, deleteEvent } = useEvents()
  const { integrations } = useIntegrations()
  const [event, setEvent] = useState(null)

  useEffect(() => {
    const found = events.find((e) => e.id === id)
    if (found) setEvent(found)
  }, [events, id])

  const handleSubmit = async (formData) => {
    try {
      await updateEvent(id, formData)
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this event?')) return
    try {
      await deleteEvent(id)
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-500">
        Event not found
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Event</h1>
        <Button variant="ghost" onClick={() => navigate('/')}>
          &larr; Back
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <EventForm
          event={event}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
          integrations={integrations}
        />
        <div className="mt-4">
          <Button variant="danger" onClick={handleDelete} className="w-full">
            Delete Event
          </Button>
        </div>
      </div>
    </div>
  )
}
