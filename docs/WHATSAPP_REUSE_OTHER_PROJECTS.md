# Reuse Twilio WhatsApp credentials in other projects

Use the **same Twilio account** across Masande and any other app that needs WhatsApp.  
Store secrets only in **local gitignored** files (`.env`, `.env.sit`), never in git.

## Credential set (variable names)

| Variable | Description | Example format |
|----------|-------------|----------------|
| `TWILIO_ACCOUNT_SID` | Twilio Console → Account Info | `AC` + 32 hex chars |
| `TWILIO_AUTH_TOKEN` | Twilio Console → Auth Token | secret string |
| `TWILIO_WHATSAPP_NUMBER` | Sandbox or approved sender | `whatsapp:+14155238886` |
| `WEBHOOK_PUBLIC_BASE_URL` | Your API public base URL | `https://api.example.com` (no trailing `/`) |

**Inbound webhook path (Masande):**  
`POST {WEBHOOK_PUBLIC_BASE_URL}/api/whatsapp/webhook`

## Spring Boot (any project)

`.env` or `.env.sit`:

```properties
TWILIO_ENABLED=true
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

`application.properties`:

```properties
twilio.accountSid=${TWILIO_ACCOUNT_SID:}
twilio.authToken=${TWILIO_AUTH_TOKEN:}
twilio.whatsappNumber=${TWILIO_WHATSAPP_NUMBER:}
twilio.enabled=${TWILIO_ENABLED:false}
```

Send message (Twilio Java SDK):

```java
Twilio.init(accountSid, authToken);
Message.creator(
    new PhoneNumber("whatsapp:+27782141216"),
    new PhoneNumber(fromWhatsAppNumber),
    "Hello from your app"
).create();
```

Validate inbound webhook:

```java
import com.twilio.security.RequestValidator;

boolean ok = new RequestValidator(authToken).validate(
    webhookUrl,  // must match Twilio console exactly
    params,      // POST form fields
  signatureHeader
);
```

## Node.js / Express

```bash
npm install twilio
```

```javascript
require('dotenv').config({ path: '.env.sit' });

const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

await client.messages.create({
  from: process.env.TWILIO_WHATSAPP_NUMBER,
  to: 'whatsapp:+27782141216',
  body: 'Hello from Node'
});
```

Webhook validation:

```javascript
const twilio = require('twilio');
const valid = twilio.validateRequest(
  process.env.TWILIO_AUTH_TOKEN,
  req.headers['x-twilio-signature'],
  `${process.env.WEBHOOK_PUBLIC_BASE_URL}/webhook/whatsapp`,
  req.body
);
```

## Python (Flask/FastAPI)

```bash
pip install twilio python-dotenv
```

```python
import os
from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv(".env.sit")
client = Client(os.environ["TWILIO_ACCOUNT_SID"], os.environ["TWILIO_AUTH_TOKEN"])

client.messages.create(
    from_=os.environ["TWILIO_WHATSAPP_NUMBER"],
    to="whatsapp:+27782141216",
    body="Hello from Python",
)
```

## .NET

```xml
<PackageReference Include="Twilio" Version="7.*" />
```

```csharp
TwilioClient.Init(
    Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID"),
    Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN"));

MessageResource.Create(
    body: "Hello",
    from: new PhoneNumber(Environment.GetEnvironmentVariable("TWILIO_WHATSAPP_NUMBER")),
    to: new PhoneNumber("whatsapp:+27782141216"));
```

## Copy template to a new repo

1. Copy `Back end/.env.sit.example` → your project `.env.sit`
2. Paste the same `TWILIO_*` values from your local Masande `.env.sit`
3. Add `.env.sit` to that project's `.gitignore`
4. Point Twilio Sandbox webhook to **one URL per environment** (only one app can receive sandbox inbound per number unless you use Twilio routing)

## Masande SIT run

```bash
cd "Back end"
# Ensure .env.sit exists (copy from .env.sit.example)
./mvnw spring-boot:run -Dspring-boot.run.profiles=sit
```

Or:

```bash
set SPRING_PROFILES_ACTIVE=sit
./mvnw spring-boot:run
```

## Security

- Rotate `TWILIO_AUTH_TOKEN` in Twilio Console if it was ever committed to git.
- Use `TWILIO_VALIDATE_WEBHOOK_SIGNATURE=true` in production.
- Never log auth tokens or full webhook payloads in production.
