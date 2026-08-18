# Event Tracking

The public website emits privacy-safe events to `window.dataLayer`. Connect Google Tag Manager (or another provider) to this data layer to send the events to GA4, Meta Pixel, or a CRM.

| Event | Trigger |
| --- | --- |
| `page_view` | Visitor opens or changes a public page |
| `view_service` | Visitor opens a service detail page |
| `view_product` | Visitor opens a product detail page |
| `whatsapp_click` | Visitor clicks a WhatsApp link |
| `phone_click` | Visitor clicks a `tel:` link |
| `email_click` | Visitor clicks a `mailto:` link |
| `download` | Visitor clicks a link with `download` |
| `contact_form_submission` | Contact form succeeds |
| `generate_lead` | A contact enquiry becomes a lead |

Do not include names, email addresses, phone numbers, messages, or other personally identifiable information in analytics event properties.
