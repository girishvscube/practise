import Mail from '@ioc:Adonis/Addons/Mail'
import Event from '@ioc:Adonis/Core/Event'

Event.on('send-otp', async ({ record }) => {
    Mail.sendLater((message) => {
        message.from('noreply@scube.me').subject(record.subject).to(record.to).html(`<div>
          ${record.message}
        </div>`)
    })
})
